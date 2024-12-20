class Users::SessionsController < Devise::SessionsController
  include RackSessionsFix

  respond_to :json

  private

  def respond_with(current_user, _opts = {}) # responding in case of a login POST
    render json: {
      status: { code: 200, message: "Logged in successfully." }
    }, status: :ok
  end

  def respond_to_on_destroy # responding in case of a logout DELETE
    if request.headers["Authorization"].present?
      jwt_payload = JWT.decode(request.headers["Authorization"].split(" ").last, Rails.application.credentials.devise_jwt_secret_key!).first
      current_user = User.find(jwt_payload["sub"])
    end

    if current_user
      render json: {
        status: {
          code: 200,
          message: "Logged out successfully."
        }
      }, status: :ok
    else
      render json: {
        status: {
          code: 401,
          message: "Couldn't find an active session."
        }
      }, status: :unauthorized
    end
  end
end
