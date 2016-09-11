object @user

attributes :id, :first_name, :last_name, :email
child(:course) { attributes :id, :name }