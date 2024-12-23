class ResidenceMessage < ApplicationRecord
  belongs_to :residence
  belongs_to :user
end
