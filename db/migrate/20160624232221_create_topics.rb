class CreateTopics < ActiveRecord::Migration
  def change
    create_table :topics do |t|
      t.string :name
      t.text :content
      t.integer :room_id
      t.integer :user_id

      t.timestamps null: false
    end
    add_index :topics, [:room_id, :user_id]
  end
end
