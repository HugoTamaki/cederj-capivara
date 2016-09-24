object @discipline

attributes :id, :name, :description, :course_id
node(:status) { |discipline| discipline.user_disciplines.find_by(user: @user).status }
