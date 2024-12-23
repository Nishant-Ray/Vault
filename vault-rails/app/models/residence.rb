class Residence < ApplicationRecord
  has_many :users, dependent: :nullify
  has_many :bills, dependent: :nullify
  has_many :residence_messages, dependent: :nullify
end
