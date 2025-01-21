class AddResidenceIdToResidenceBills < ActiveRecord::Migration[8.0]
  def change
    add_reference :residence_bills, :residence, null: false, foreign_key: true
  end
end
