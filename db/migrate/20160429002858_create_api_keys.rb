class CreateApiKeys < ActiveRecord::Migration
  def change
    create_table :api_keys do |t|
      t.string :secret
      t.string :key
      t.datetime :expires_at
      t.integer :user_id

      t.timestamps null: false
    end
  end
end
