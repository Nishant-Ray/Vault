class AddForeignKeyToTransactionForAccount < ActiveRecord::Migration[8.0]
  def change
    add_foreign_key :transactions, :accounts
  end
end
