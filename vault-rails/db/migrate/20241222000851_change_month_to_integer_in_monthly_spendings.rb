class ChangeMonthToIntegerInMonthlySpendings < ActiveRecord::Migration[8.0]
  def change
    change_column :monthly_spendings, :month, :integer, using: 'month::integer'
  end
end
