class Users::RegistrationsController < Devise::RegistrationsController
  include RackSessionsFix

  respond_to :json

  private

  def respond_with(current_user, _opts = {}) # responding in case of a signup POST
    if resource.persisted?
      render json: {
        status: { code: 200, message: "Signed up successfully." }
      }
    else
      render json: {
        status: { code: 500, message: "User couldn't be created successfully. #{current_user.errors.full_messages.to_sentence}" }
      }, status: unprocessable_entity
    end
  end
end
