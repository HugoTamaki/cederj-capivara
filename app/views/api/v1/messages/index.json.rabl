collection @messages, root: 'messages', object_root: false

attributes :id, :content, :topic_id
node(:created_at) { |message| message.created_at.to_time.as_json }
node(:updated_at) { |message| message.updated_at.to_time.as_json }
child(:user) { attributes :id, :first_name, :last_name, :email }
