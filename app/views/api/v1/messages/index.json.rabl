collection @messages, root: 'messages', object_root: false

attributes :id, :content, :topic_id
child(:user) { attributes :id, :first_name, :last_name, :email }
