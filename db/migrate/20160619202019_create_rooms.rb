class CreateRooms < ActiveRecord::Migration
  def change
    create_table :rooms do |t|
      t.string :name
      t.boolean :public
      t.integer :user_id

      t.timestamps null: false
    end

    add_index :rooms, :user_id
  end
end
