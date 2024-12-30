class AddMonthlySpendingIdToTransactions < ActiveRecord::Migration[8.0]
  def change
    add_reference :transactions, :monthly_spending, null: false, foreign_key: true
  end
end
