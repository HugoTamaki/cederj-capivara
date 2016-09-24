object @user

attributes :id, :first_name, :last_name, :email
child(:course) { attributes :id, :name }

if @api_key.user != @user
  node :current_disciplines do |user|
    user.current_disciplines.map do |discipline|
      partial("api/v1/disciplines/show", object: discipline)
    end
  end

  node :common_disciplines do |user|
    user.common_disciplines_with(@api_key.user).map do |discipline|
      partial("api/v1/disciplines/show", object: discipline)
    end
  end
end
