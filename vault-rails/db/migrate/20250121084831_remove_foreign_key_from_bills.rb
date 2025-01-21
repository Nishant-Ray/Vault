class RemoveForeignKeyFromBills < ActiveRecord::Migration[8.0]
  def change
    remove_foreign_key :bills, :residences
  end
end
