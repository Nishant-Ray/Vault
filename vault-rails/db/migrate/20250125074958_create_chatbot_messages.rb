class CreateChatbotMessages < ActiveRecord::Migration[8.0]
  def change
    create_table :chatbot_messages do |t|
      t.string :content
      t.boolean :from_user

      t.timestamps
    end
  end
end
