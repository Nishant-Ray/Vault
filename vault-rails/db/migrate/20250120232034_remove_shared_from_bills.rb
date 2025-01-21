class RemoveSharedFromBills < ActiveRecord::Migration[8.0]
  def change
    remove_column :bills, :shared, :boolean
  end
end
