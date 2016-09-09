collection @rooms, root: 'rooms', object_root: false

attributes :id, :name, :public
node(:created_at) { |room| room.created_at.to_time.as_json }
node(:updated_at) { |room| room.updated_at.to_time.as_json }
child(:user) { attributes :id, :first_name, :last_name, :email }