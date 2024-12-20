class CreateTransactions < ActiveRecord::Migration[8.0]
  def change
    create_table :transactions do |t|
      t.integer :user_id, null: false
      t.integer :account_id, null: false
      t.integer :date, null: false
      t.float :amount, null: false
      t.string :description, null: false
      t.string :category, null: false

      t.timestamps
    end
  end
end
