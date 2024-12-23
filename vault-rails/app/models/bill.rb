class Bill < ApplicationRecord
  belongs_to :user
  belongs_to :residence, optional: true
end
