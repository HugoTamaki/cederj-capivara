class CreateRoomUsers < ActiveRecord::Migration
  def change
    create_table :room_users do |t|
      t.integer :room_id
      t.integer :user_id

      t.timestamps null: false
    end
    add_index :room_users, [:room_id, :user_id]
  end
end
