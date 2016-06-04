class AddCourseIdToUsers < ActiveRecord::Migration
  def change
    add_column :users, :course_id, :integer
    add_index :users, :course_id
  end
end
