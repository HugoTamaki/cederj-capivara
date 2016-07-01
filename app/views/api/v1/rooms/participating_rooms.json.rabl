collection @participating_rooms, root: 'rooms', object_root: false

attributes :id, :name, :public
child(:user) { attributes :id, :first_name, :last_name, :email }