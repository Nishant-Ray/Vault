class Transaction < ApplicationRecord
  belongs_to :user
  belongs_to :account
  belongs_to :monthly_spending
end
