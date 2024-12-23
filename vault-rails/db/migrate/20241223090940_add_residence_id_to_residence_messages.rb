class AddResidenceIdToResidenceMessages < ActiveRecord::Migration[8.0]
  def change
    add_reference :residence_messages, :residence, null: false, foreign_key: true
  end
end
