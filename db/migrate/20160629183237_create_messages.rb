class CreateMessages < ActiveRecord::Migration
  def change
    create_table :messages do |t|
      t.text :content
      t.integer :topic_id
      t.integer :user_id

      t.timestamps null: false
    end
    add_index :messages, [:topic_id, :user_id]
  end
end
