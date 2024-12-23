class CreateBills < ActiveRecord::Migration[8.0]
  def change
    create_table :bills do |t|
      t.integer :user_id
      t.string :name
      t.string :category
      t.integer :due_date
      t.boolean :shared

      t.timestamps
    end
  end
end
