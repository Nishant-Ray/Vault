class RemoveLastDigitsFromAccounts < ActiveRecord::Migration[8.0]
  def change
    remove_column :accounts, :last_digits, :integer
  end
end
