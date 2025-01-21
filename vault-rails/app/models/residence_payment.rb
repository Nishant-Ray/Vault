class ResidencePayment < ApplicationRecord
  belongs_to :payer, class_name: "User"
  belongs_to :payee, class_name: "User", optional: true
  belongs_to :residence_bill
end
