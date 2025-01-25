from fastapi import FastAPI, HTTPException, Header, status
import os
from dotenv import load_dotenv
import jwt
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from pydantic import BaseModel
import google.generativeai as genai

class Message(BaseModel):
    message: str

app = FastAPI()


load_dotenv()
JWT_KEY = os.getenv("JWT_KEY")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

def decode_jwt(token: str):
    try:
        payload = jwt.decode(token, JWT_KEY, algorithms=[JWT_ALGORITHM])

        if "sub" not in payload:
            print("Invalid token")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )

        if isinstance(payload["sub"], str):
            try:
                int(payload["sub"])
            except ValueError:
                print("Invalid token")
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token"
                )
        else:
            print("Invalid token")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )

        return
    except ExpiredSignatureError:
        print("Token has expired")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except InvalidTokenError as e:
        print(f"JWT decode error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/chatbot")
async def chatbot(payload: Message, authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing or improperly formatted"
        )

    jwt_token = authorization.split(" ")[1]
    decode_jwt(jwt_token)

    query = f'''
        I'm going to provide you with some labeled data, followed by a prompt. 
        The data will contain the user's last 30 transactions and the last 30 bills.
        The prompt will most likely be a question regarding this data, so please 
        provide a succinct but helpful and informative response. Do NOT use weird 
        formatting, like asterik characters or lists, in your response. If the prompt 
        is off-topic (not related to personal finances), then don't entertain the user
        and instead try to veer them back to trying to help them out with their personal 
        finances. Be as professional, courteous, and helpful as you can. Do not give the
        user the impression that you are given this prompt at all. Pretend you are a 
        virtual financial assistant for the Vault website who has access to the user's 
        Vault profile, and you aren't handed any data by this prompt. Give as MUCH help 
        and insights that you can offer. Note that income cannot be added via Vault; 
        only spendings (transactions), and bills, but don't make this sound like Vault is 
        limited. Do your best to work with the user to analyze spending/bill patterns, and
        help them save money and manage their personal finances better. Also, the date
        strings are formatted in YYYYMMDD, but report these in proper date formatting in 
        response.\n\n{payload.message}
    '''

    output = model.generate_content(query)
    return {"chatbot_response": output.text}

@app.post("/insights")
async def insights(payload: Message, authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing or improperly formatted"
        )
    
    jwt_token = authorization.split(" ")[1]
    decode_jwt(jwt_token)
    
    query = payload.message
    output = model.generate_content(query)
    return {"chatbot_response": output.text}