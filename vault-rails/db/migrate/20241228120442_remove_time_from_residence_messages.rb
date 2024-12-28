class RemoveTimeFromResidenceMessages < ActiveRecord::Migration[8.0]
  def change
    remove_column :residence_messages, :time, :integer
  end
end
