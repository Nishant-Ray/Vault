class AddResidenceIdToUsers < ActiveRecord::Migration[8.0]
  def change
    add_reference :users, :residence, foreign_key: true
  end
end
