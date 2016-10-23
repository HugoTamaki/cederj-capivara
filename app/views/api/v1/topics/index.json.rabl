collection @topics, root: 'topics', object_root: false

attributes :id, :name, :content
node(:created_at) { |topic| topic.created_at.to_time.as_json }
node(:updated_at) { |topic| topic.updated_at.to_time.as_json }
child(:room) { attributes :id, :name }
child(:user) { attributes :id, :first_name, :last_name, :email }