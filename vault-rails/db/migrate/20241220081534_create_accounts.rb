class CreateAccounts < ActiveRecord::Migration[8.0]
  def change
    create_table :accounts do |t|
      t.integer :user_id, null: false
      t.string :nickname, null: false
      t.integer :last_digits, null: false
      t.boolean :is_credit_card, null: false

      t.timestamps
    end
  end
end
