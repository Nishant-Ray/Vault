include ActionView::Helpers::NumberHelper

class ResidencePaymentsController < ApplicationController
  def add
    if request.headers["Authorization"].present?
      jwt_payload = JWT.decode(request.headers["Authorization"].split(" ").last, Rails.application.credentials.devise_jwt_secret_key!).first
      current_user = User.find(jwt_payload["sub"])
    end

    if current_user
      if current_user.residence
        payee_id = params[:payee_id] == "null" ? nil : params[:payee_id].to_i

        new_payment = ResidencePayment.create(residence_bill_id: params[:residence_bill_id], payer_id: params[:payer_id], payee_id: payee_id, amount: params[:amount], status: "Pending")

        render json: {
          status: { code: 200, message: "Successfully added residence payment." },
          data: { residence_payment: new_payment }
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
        payee_id = params[:payee_id] == "null" ? nil : params[:payee_id].to_i

        payment = ResidencePayment.find(params[:id])
        payment.update(payee_id: payee_id, amount: params[:amount])

        render json: {
          status: { code: 200, message: "Successfully edited residence payment." }
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
        payment = ResidencePayment.find(params[:id])
        payment.destroy

        render json: {
          status: { code: 200, message: "Successfully removed residence payment." }
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

  def pay
    if request.headers["Authorization"].present?
      jwt_payload = JWT.decode(request.headers["Authorization"].split(" ").last, Rails.application.credentials.devise_jwt_secret_key!).first
      current_user = User.find(jwt_payload["sub"])
    end

    if current_user
      if current_user.residence
        payment = ResidencePayment.find(params[:id])
        payment.update(status: "Paid")

        formatted_due_date = Date.strptime(payment.residence_bill.due_date.to_s, "%Y%m%d").strftime("%m/%d/%Y")
        if params[:payee_id]
          payee_name = User.find(params[:payee_id]).name
          message = "#{current_user.name} paid #{number_to_currency(payment.amount)} to #{payee_name} for #{payment.residence_bill.category} Bill due #{formatted_due_date}"
        else
          message = "#{current_user.name} paid #{number_to_currency(payment.amount)} directly to #{payment.residence_bill.category} Bill due #{formatted_due_date}"
        end

        message = ResidenceMessage.create(content: message, is_update: true, residence_id: current_user.residence.id, user_id: current_user.id)

        render json: {
          status: { code: 200, message: "Successfully paid residence payment." },
          data: { new_message: message }
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
