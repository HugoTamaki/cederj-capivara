collection @topics, root: 'topics', object_root: false

attributes :id, :name, :content
child(:user) { attributes :id, :first_name, :last_name, :email }