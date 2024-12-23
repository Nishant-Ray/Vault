class AddUserIdToResidenceMessages < ActiveRecord::Migration[8.0]
  def change
    add_reference :residence_messages, :user, null: false, foreign_key: true
  end
end
