class AddForeignKeyToMonthlySpendings < ActiveRecord::Migration[8.0]
  def change
    add_foreign_key :monthly_spendings, :users
  end
end
