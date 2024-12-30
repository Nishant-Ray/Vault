class MonthlySpending < ApplicationRecord
  has_many :transactions, dependent: :nullify
  belongs_to :user
end
