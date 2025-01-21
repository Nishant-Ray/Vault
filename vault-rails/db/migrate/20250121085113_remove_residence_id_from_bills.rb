class RemoveResidenceIdFromBills < ActiveRecord::Migration[8.0]
  def change
    remove_column :bills, :residence_id, :bigint
    remove_index :bills, name: "index_bills_on_residence_id" if index_exists?(:bills, :residence_id)
  end
end
