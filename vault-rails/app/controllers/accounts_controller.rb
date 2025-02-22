class AccountsController < ApplicationController
  def get_all
    if request.headers["Authorization"].present?
      jwt_payload = JWT.decode(request.headers["Authorization"].split(" ").last, Rails.application.credentials.devise_jwt_secret_key!).first
      current_user = User.find(jwt_payload["sub"])
    end

    if current_user
      render json: {
        status: { code: 200, message: "Successfully retrieved user's accounts." },
        data: { accounts: Account.where(user_id: current_user.id).order(created_at: :desc) }
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

  def add
    if request.headers["Authorization"].present?
      jwt_payload = JWT.decode(request.headers["Authorization"].split(" ").last, Rails.application.credentials.devise_jwt_secret_key!).first
      current_user = User.find(jwt_payload["sub"])
    end

    if current_user
      new_account = Account.create(user_id: current_user.id, nickname: params[:nickname], is_credit_card: params[:is_credit_card])
      render json: {
        status: { code: 200, message: "Successfully added account." },
        data: { account: new_account }
      }
    else
      render json: {
        status: {
          code: 401,
          message: "Unauthorized."
        }
      }, status: :unauthorized
    end
  end

  def remove
    if request.headers["Authorization"].present?
      jwt_payload = JWT.decode(request.headers["Authorization"].split(" ").last, Rails.application.credentials.devise_jwt_secret_key!).first
      current_user = User.find(jwt_payload["sub"])
    end

    if current_user
      Account.find(params[:id]).destroy
      render json: {
        status: { code: 200, message: "Successfully removed account." }
      }
    else
      render json: {
        status: {
          code: 401,
          message: "Unauthorized."
        }
      }, status: :unauthorized
    end
  end

  def change_nickname
    if request.headers["Authorization"].present?
      jwt_payload = JWT.decode(request.headers["Authorization"].split(" ").last, Rails.application.credentials.devise_jwt_secret_key!).first
      current_user = User.find(jwt_payload["sub"])
    end

    if current_user
      account = Account.find(params[:id])
      account.update(nickname: params[:nickname])
      render json: {
        status: { code: 200, message: "Successfully changed nickname." }
      }
    else
      render json: {
        status: {
          code: 401,
          message: "Unauthorized."
        }
      }, status: :unauthorized
    end
  end
end
