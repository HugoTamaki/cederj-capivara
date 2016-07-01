object @topic

attributes :id, :name, :content, :room_id
child(:user) { attributes :id, :first_name, :last_name, :email }