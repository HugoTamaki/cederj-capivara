collection @topics, root: 'topics', object_root: false

attributes :id, :name, :content
child(:room) { attributes :id, :name }
child(:user) { attributes :id, :first_name, :last_name, :email }