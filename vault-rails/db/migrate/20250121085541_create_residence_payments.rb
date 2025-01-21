class CreateResidencePayments < ActiveRecord::Migration[8.0]
  def change
    create_table :residence_payments do |t|
      t.integer :payer_id, null: false
      t.integer :payee_id
      t.integer :residence_bill_id, null: false
      t.float :amount, null: false
      t.string :status, null: false

      t.timestamps
    end

    add_foreign_key :residence_payments, :users, column: :payer_id
    add_foreign_key :residence_payments, :users, column: :payee_id
    add_foreign_key :residence_payments, :residence_bills
  end
end
