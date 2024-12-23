class AddResidenceIdToBills < ActiveRecord::Migration[8.0]
  def change
    add_reference :bills, :residence, foreign_key: true
  end
end
