class ResidenceBillsController < ApplicationController
  def get_all
    if request.headers["Authorization"].present?
      jwt_payload = JWT.decode(request.headers["Authorization"].split(" ").last, Rails.application.credentials.devise_jwt_secret_key!).first
      current_user = User.find(jwt_payload["sub"])
    end

    if current_user
      if current_user.residence
        # ...

        render json: {
          status: { code: 200, message: "Successfully _____." },
          data: { }
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

  def get_by_month
    if request.headers["Authorization"].present?
      jwt_payload = JWT.decode(request.headers["Authorization"].split(" ").last, Rails.application.credentials.devise_jwt_secret_key!).first
      current_user = User.find(jwt_payload["sub"])
    end

    if current_user
      if current_user.residence
        # ...

        render json: {
          status: { code: 200, message: "Successfully _____." },
          data: { }
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

  def get_payments
    if request.headers["Authorization"].present?
      jwt_payload = JWT.decode(request.headers["Authorization"].split(" ").last, Rails.application.credentials.devise_jwt_secret_key!).first
      current_user = User.find(jwt_payload["sub"])
    end

    if current_user
      if current_user.residence
        # ...

        render json: {
          status: { code: 200, message: "Successfully _____." },
          data: { }
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

  def add
    if request.headers["Authorization"].present?
      jwt_payload = JWT.decode(request.headers["Authorization"].split(" ").last, Rails.application.credentials.devise_jwt_secret_key!).first
      current_user = User.find(jwt_payload["sub"])
    end

    if current_user
      if current_user.residence
        # ...

        render json: {
          status: { code: 200, message: "Successfully _____." },
          data: { }
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

  def edit
    if request.headers["Authorization"].present?
      jwt_payload = JWT.decode(request.headers["Authorization"].split(" ").last, Rails.application.credentials.devise_jwt_secret_key!).first
      current_user = User.find(jwt_payload["sub"])
    end

    if current_user
      if current_user.residence
        # ...

        render json: {
          status: { code: 200, message: "Successfully _____." },
          data: { }
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

  def remove
    if request.headers["Authorization"].present?
      jwt_payload = JWT.decode(request.headers["Authorization"].split(" ").last, Rails.application.credentials.devise_jwt_secret_key!).first
      current_user = User.find(jwt_payload["sub"])
    end

    if current_user
      if current_user.residence
        # ...

        render json: {
          status: { code: 200, message: "Successfully _____." },
          data: { }
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
