require "bigdecimal"

class MonthlySpendingsController < ApplicationController
  def get
    if request.headers["Authorization"].present?
      jwt_payload = JWT.decode(request.headers["Authorization"].split(" ").last, Rails.application.credentials.devise_jwt_secret_key!).first
      current_user = User.find(jwt_payload["sub"])
    end

    if current_user
      monthly_spending = MonthlySpending.find_by(user_id: current_user.id, month: params[:month])

      if monthly_spending
        render json: {
          status: { code: 200, message: "Retrieved monthly spending successfully." },
          data: { monthly_spending: MonthlySpendingSerializer.new(monthly_spending).serializable_hash[:data][:attributes] }
        }, status: :ok
      else
        render json: {
          status: { code: 404, message: "Could not find existing monthly spending." }
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

  def add_to_total
    if request.headers["Authorization"].present?
      jwt_payload = JWT.decode(request.headers["Authorization"].split(" ").last, Rails.application.credentials.devise_jwt_secret_key!).first
      current_user = User.find(jwt_payload["sub"])
    end

    if current_user
      monthly_spending = MonthlySpending.find_by(user_id: current_user.id, month: params[:month])

      if monthly_spending
        monthly_spending.update(total: monthly_spending.total + params[:amount].to_f)
        render json: {
          status: { code: 200, message: "Added to monthly spending successfully." }
        }, status: :ok
      else
        MonthlySpending.create(user_id: current_user.id, month: params[:month], total: params[:amount].to_f)
        render json: {
          status: { code: 200, message: "Created new monthly spending successfully." }
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

  def subtract_from_total
    if request.headers["Authorization"].present?
      jwt_payload = JWT.decode(request.headers["Authorization"].split(" ").last, Rails.application.credentials.devise_jwt_secret_key!).first
      current_user = User.find(jwt_payload["sub"])
    end

    if current_user
      monthly_spending = MonthlySpending.find_by(user_id: current_user.id, month: params[:month])

      if monthly_spending
        monthly_spending.update(total: monthly_spending.total - params[:amount].to_f)
        render json: {
          status: { code: 200, message: "Subtracted from monthly spending successfully." }
        }, status: :ok
      else
        render json: {
          status: { code: 404, message: "Could not find existing monthly spending." }
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
