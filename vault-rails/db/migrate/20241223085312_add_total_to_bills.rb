class AddTotalToBills < ActiveRecord::Migration[8.0]
  def change
    add_column :bills, :total, :float
  end
end
