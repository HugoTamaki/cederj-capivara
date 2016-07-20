object @room

attributes :id, :name, :public
child(:user) { attributes :id, :first_name, :last_name, :email, :room_ids }