class ResidenceBill < ApplicationRecord
  belongs_to :residence, optional: true
  has_many :residence_payments, dependent: :destroy
end
