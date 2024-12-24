class ResidenceMessagesController < ApplicationController
  def get_recent
    if request.headers["Authorization"].present?
      jwt_payload = JWT.decode(request.headers["Authorization"].split(" ").last, Rails.application.credentials.devise_jwt_secret_key!).first
      current_user = User.find(jwt_payload["sub"])
    end

    if current_user
      if current_user.residence
        render json: {
          status: { code: 200, message: "Successfully retrieved residence messages." },
          data: { messages: current_user.residence.residence_messages.order(time: :asc).last(5) } # least recent first in array
        }, status: :ok
      else
        render json: {
          status: { code: 404, message: "User does not have a residence." }
        }, status: :not_found
      end
    else
      render json: {
        status: {
          code: 401,
          message: "Unauthorized."
        }
      }, status: :unauthorized
    end
  end

  def get_all
    if request.headers["Authorization"].present?
      jwt_payload = JWT.decode(request.headers["Authorization"].split(" ").last, Rails.application.credentials.devise_jwt_secret_key!).first
      current_user = User.find(jwt_payload["sub"])
    end

    if current_user
      if current_user.residence
        render json: {
          status: { code: 200, message: "Successfully retrieved residence messages." },
          data: { messages: current_user.residence.residence_messages.order(time: :asc).last(50) } # least recent first in array
        }, status: :ok
      else
        render json: {
          status: { code: 404, message: "User does not have a residence." }
        }, status: :not_found
      end
    else
      render json: {
        status: {
          code: 401,
          message: "Unauthorized."
        }
      }, status: :unauthorized
    end
  end

  def create
    if request.headers["Authorization"].present?
      jwt_payload = JWT.decode(request.headers["Authorization"].split(" ").last, Rails.application.credentials.devise_jwt_secret_key!).first
      current_user = User.find(jwt_payload["sub"])
    end

    if current_user
      if current_user.residence
        new_message = ResidenceMessage.create(time: params[:time], is_update: params[:is_update], content: params[:content])
        new_message.user = current_user
        new_message.residence = current_user.residence
        render json: {
          status: { code: 200, message: "Successfully created residence message." },
          data: { name: current_user.residence.name, users: current_user.residence.users }
        }, status: :ok
      else
        render json: {
          status: { code: 404, message: "User does not have a residence." }
        }, status: :not_found
      end
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
