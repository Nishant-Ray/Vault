class ResidencesController < ApplicationController
  def get_info
    if request.headers["Authorization"].present?
      jwt_payload = JWT.decode(request.headers["Authorization"].split(" ").last, Rails.application.credentials.devise_jwt_secret_key!).first
      current_user = User.find(jwt_payload["sub"])
    end

    if current_user
      if current_user.residence
        render json: {
          status: { code: 200, message: "Successfully retrieved residence info." },
          data: { residence: current_user.residence, users: current_user.residence.users } # TODO: make users: be usernames, not array of every user object
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
        render json: {
          status: { code: 400, message: "User already has a residence." }
        }, status: :bad_request
      else
        new_residence = Residence.create(name: params[:name], monthly_payment: params[:monthly_payment])
        current_user.residence = new_residence
        current_user.save

        render json: {
          status: { code: 200, message: "Successfully created residence." }
        }, status: :ok
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

  def edit
    if request.headers["Authorization"].present?
      jwt_payload = JWT.decode(request.headers["Authorization"].split(" ").last, Rails.application.credentials.devise_jwt_secret_key!).first
      current_user = User.find(jwt_payload["sub"])
    end

    if current_user
      if current_user.residence
        current_user.residence.update(name: params[:name], monthly_payment: params[:monthly_payment])

        render json: {
          status: { code: 200, message: "Successfully edited residence." }
        }, status: :ok
      else
        render json: {
          status: { code: 404, message: "User has no residence." }
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

  def leave
    if request.headers["Authorization"].present?
      jwt_payload = JWT.decode(request.headers["Authorization"].split(" ").last, Rails.application.credentials.devise_jwt_secret_key!).first
      current_user = User.find(jwt_payload["sub"])
    end

    if current_user
      if current_user.residence
        current_user.residence = nil
        current_user.save

        render json: {
          status: { code: 200, message: "Successfully left residence." }
        }, status: :ok
      else
        render json: {
          status: { code: 404, message: "User has no residence." }
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


  def delete
    if request.headers["Authorization"].present?
      jwt_payload = JWT.decode(request.headers["Authorization"].split(" ").last, Rails.application.credentials.devise_jwt_secret_key!).first
      current_user = User.find(jwt_payload["sub"])
    end

    if current_user
      if current_user.residence
        current_user.residence.destroy

        render json: {
          status: { code: 200, message: "Successfully deleted residence." }
        }, status: :ok
      else
        render json: {
          status: { code: 404, message: "User has no residence." }
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

  def invite_resident
    if request.headers["Authorization"].present?
      jwt_payload = JWT.decode(request.headers["Authorization"].split(" ").last, Rails.application.credentials.devise_jwt_secret_key!).first
      current_user = User.find(jwt_payload["sub"])
    end

    if current_user
      if current_user.residence
        other_user = User.find_by(email: params[:email])

        if other_user
          if other_user.id == current_user.id || current_user.residence.users.include?(other_user)
            render json: {
              status: { code: 400, message: "Unable to add existing user to residence." }
            }, status: :bad_request
          else
            other_user.residence = current_user.residence # TODO: create a notification record instead of just adding user
            other_user.save

            message = ResidenceMessage.create(content: "#{current_user.name} added #{other_user.name} to residence", is_update: true, residence_id: current_user.residence.id, user_id: current_user.id)

            render json: {
              status: { code: 200, message: "Successfully invited user to residence." },
              data: { resident: other_user, new_message: message }
            }, status: :ok
          end
        else
          render json: {
            status: { code: 404, message: "No such user found." }
          }, status: :not_found
        end
      else
        render json: {
          status: { code: 404, message: "Current user has no residence." }
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

  def remove_resident
    if request.headers["Authorization"].present?
      jwt_payload = JWT.decode(request.headers["Authorization"].split(" ").last, Rails.application.credentials.devise_jwt_secret_key!).first
      current_user = User.find(jwt_payload["sub"])
    end

    if current_user
      if current_user.residence
        other_user = User.find(params[:id])
        other_user.residence = nil
        other_user.save

        message = ResidenceMessage.create(content: "#{current_user.name} removed #{other_user.name} from residence", is_update: true, residence_id: current_user.residence.id, user_id: current_user.id)

        render json: {
          status: { code: 200, message: "Successfully removed user from residence." },
          data: { new_message: message }
        }, status: :ok
      else
        render json: {
          status: { code: 404, message: "Current user has no residence." }
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
