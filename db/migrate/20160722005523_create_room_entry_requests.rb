class CreateRoomEntryRequests < ActiveRecord::Migration
  def change
    create_table :room_entry_requests do |t|
      t.integer :room_id
      t.integer :sender_id
      t.integer :receiver_id
      t.string :token

      t.timestamps null: false
    end

    add_index :room_entry_requests, :room_id
    add_index :room_entry_requests, :sender_id
    add_index :room_entry_requests, :receiver_id
  end
end
