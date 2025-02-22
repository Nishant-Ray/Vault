class UserController < ApplicationController
  before_action :authenticate_user! # ensures only see 200 response if have valid JWT in headers; otherwise, should return 401
  def index
    render json: UserSerializer.new(current_user).serializable_hash[:data][:attributes], status: :ok
  end

  def get_current_user_name
    if request.headers["Authorization"].present?
      jwt_payload = JWT.decode(request.headers["Authorization"].split(" ").last, Rails.application.credentials.devise_jwt_secret_key!).first
      current_user = User.find(jwt_payload["sub"])
    end

    if current_user
      render json: {
        status: { code: 200, message: "Retrieved current user's name successfully." },
        data: { name: current_user.name }
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

  def get_current_user_id
    if request.headers["Authorization"].present?
      jwt_payload = JWT.decode(request.headers["Authorization"].split(" ").last, Rails.application.credentials.devise_jwt_secret_key!).first
      current_user = User.find(jwt_payload["sub"])
    end

    if current_user
      render json: {
        status: { code: 200, message: "Retrieved current user's id successfully." },
        data: { id: current_user.id }
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
end
