collection @messages, root: 'messages', object_root: false

attributes :id, :content, :topic_id
node(:created_at) { |message| message.created_at.to_time.iso8601 }
node(:updated_at) { |message| message.updated_at.to_time.iso8601 }
child(:user) { attributes :id, :first_name, :last_name, :email }
