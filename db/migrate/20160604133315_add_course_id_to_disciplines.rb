class AddCourseIdToDisciplines < ActiveRecord::Migration
  def change
    add_column :disciplines, :course_id, :integer
    add_index :disciplines, :course_id
  end
end
