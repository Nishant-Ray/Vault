class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :jwt_authenticatable, jwt_revocation_strategy: self

  has_many :monthly_spendings, dependent: :nullify
  has_many :accounts, dependent: :nullify
  has_many :transactions, dependent: :nullify
  has_many :bills
  has_many :residence_messages

  belongs_to :residence, optional: true
end
