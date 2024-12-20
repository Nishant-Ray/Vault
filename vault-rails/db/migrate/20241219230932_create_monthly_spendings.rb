class CreateMonthlySpendings < ActiveRecord::Migration[8.0]
  def change
    create_table :monthly_spendings do |t|
      t.integer :user_id, null: false
      t.string :month, null: false
      t.decimal :total, precision: 10, scale: 2, null: false

      t.timestamps
    end
  end
end
