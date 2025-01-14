class TransactionsController < ApplicationController
  def get_recent
    if request.headers["Authorization"].present?
      jwt_payload = JWT.decode(request.headers["Authorization"].split(" ").last, Rails.application.credentials.devise_jwt_secret_key!).first
      current_user = User.find(jwt_payload["sub"])
    end

    if current_user
      render json: {
        status: { code: 200, message: "Successfully retrieved recent transactions." },
        data: { transactions: Transaction.where(user_id: current_user.id).order(date: :desc).first(5) }
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

  def get_by_month
    if request.headers["Authorization"].present?
      jwt_payload = JWT.decode(request.headers["Authorization"].split(" ").last, Rails.application.credentials.devise_jwt_secret_key!).first
      current_user = User.find(jwt_payload["sub"])
    end

    if current_user
      start_date = (params[:month] + "01").to_i # 20241201
      end_date = (params[:month] + "31").to_i # 20241231

      render json: {
        status: { code: 200, message: "Successfully retrieved monthly transactions." },
        data: { transactions: Transaction.where(user_id: current_user.id).where("date >= ? AND date <= ?", start_date, end_date).order(date: :desc) }
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
      new_transaction = Transaction.create(user_id: current_user.id, account_id: params[:account_id], date: params[:date], amount: params[:amount].to_f, category: params[:category], description: params[:description])
      calculated_month = params[:date].to_s[0, 6].to_i
      relevant_monthly_spending = MonthlySpending.where(user_id: current_user.id, month: calculated_month).take
      if !relevant_monthly_spending
        relevant_monthly_spending = MonthlySpending.create(user_id: current_user.id, month: calculated_month, total: params[:amount].to_f)
      else
        relevant_monthly_spending.update(total: relevant_monthly_spending.total + params[:amount].to_f)
      end
      new_transaction.monthly_spending = relevant_monthly_spending
      new_transaction.save
      render json: {
        status: { code: 200, message: "Successfully added transaction." },
        data: { transaction: new_transaction }
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
      Transaction.find(params[:id]).destroy
      render json: {
        status: { code: 200, message: "Successfully removed transaction." }
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
