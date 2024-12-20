class AddForeignKeyAccountToUser < ActiveRecord::Migration[8.0]
  def change
    add_foreign_key :accounts, :users
  end
end
