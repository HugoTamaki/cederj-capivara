object @user

attributes :id, :first_name, :last_name, :email
child(:course) { attributes :id, :name }
node :current_disciplines do |user|
  user.current_disciplines.map do |discipline|
    partial("api/v1/disciplines/show", object: discipline)
  end
end
