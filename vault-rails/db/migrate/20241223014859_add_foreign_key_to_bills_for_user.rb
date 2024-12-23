class AddForeignKeyToBillsForUser < ActiveRecord::Migration[8.0]
  def change
    add_foreign_key :bills, :users
  end
end
