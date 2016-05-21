class CreateUserDisciplines < ActiveRecord::Migration
  def change
    create_table :user_disciplines do |t|
      t.integer :user_id
      t.integer :discipline_id
      t.string :status, default: 'incomplete'

      t.timestamps null: false
    end

    add_index :user_disciplines, [:user_id, :discipline_id]
  end
end
