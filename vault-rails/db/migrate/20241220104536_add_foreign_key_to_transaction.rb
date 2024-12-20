class AddForeignKeyToTransaction < ActiveRecord::Migration[8.0]
  def change
    add_foreign_key :transactions, :users
  end
end
