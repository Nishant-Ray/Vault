class CreateResidenceMessages < ActiveRecord::Migration[8.0]
  def change
    create_table :residence_messages do |t|
      t.string :content
      t.boolean :is_update
      t.integer :time

      t.timestamps
    end
  end
end
