class Transaction < ApplicationRecord
  belongs_to :user
  belongs_to :account
  belongs_to :monthly_spending

  def to_s
    "(Transaction #{self.id}: {Date: #{self.date}, Amount: #{self.amount}, Category: #{self.category}, Description: #{self.description}})"
  end
end
