class AddMonthlyPaymentToResidences < ActiveRecord::Migration[8.0]
  def change
    add_column :residences, :monthly_payment, :string
  end
end
