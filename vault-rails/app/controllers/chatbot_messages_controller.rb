class ChatbotMessagesController < ApplicationController
  def get
    if request.headers["Authorization"].present?
      jwt_payload = JWT.decode(request.headers["Authorization"].split(" ").last, Rails.application.credentials.devise_jwt_secret_key!).first
      current_user = User.find(jwt_payload["sub"])
    end

    if current_user
      render json: {
        status: { code: 200, message: "Successfully retrieved chatbot messages." },
        data: { messages: ChatbotMessage.where(user_id: current_user.id).order(created_at: :asc).last(50) }
      }, status: :ok
    else
      render json: {
        status: {
          code: 401,
          message: "Unauthorized."
        }
      }, status: :unauthorized
    end
  end

  def ask
    if request.headers["Authorization"].present?
      jwt = request.headers["Authorization"].split(" ").last
      jwt_payload = JWT.decode(jwt, Rails.application.credentials.devise_jwt_secret_key!).first
      current_user = User.find(jwt_payload["sub"])
      if jwt && current_user
        message_content = Transaction.where(user_id: current_user.id).order(date: :desc).limit(30).map(&:to_s).join("\n") + "\n\n" +
                          Bill.where(user_id: current_user.id).order(due_date: :asc).limit(30).map(&:to_s).join("\n") +
                          "\n\nPROMPT: " + params[:message]

        response = HTTParty.post(
          "http://127.0.0.1:8000/chatbot",
          body: JSON.generate({ message: message_content }),
          headers: { 'Content-Type' => 'application/json', 'Authorization' => "Bearer #{jwt}" }
        )

        if response.success?
          user_message = ChatbotMessage.create(user_id: current_user.id, content: params[:message], from_user: true)
          chatbot_message = ChatbotMessage.create(user_id: current_user.id, content: response["chatbot_response"], from_user: false)
          render json: {
            status: { code: 200, message: "Successfully asked chatbot question." },
            data: { user_message: user_message, chatbot_message: chatbot_message }
          }, status: :ok
        else
          render json: { error: "Failed to ask chatbot question" }
        end
        return
      else
        render json: {
          status: {
            code: 401,
            message: "Unauthorized."
          }
        }, status: :unauthorized
      end
    end

    render json: {
      status: {
        code: 401,
        message: "Unauthorized."
      }
    }, status: :unauthorized
  end
end
