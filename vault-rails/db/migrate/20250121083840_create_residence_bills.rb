class CreateResidenceBills < ActiveRecord::Migration[8.0]
  def change
    create_table :residence_bills do |t|
      t.float :total
      t.string :category
      t.integer :due_date

      t.timestamps
    end
  end
end
