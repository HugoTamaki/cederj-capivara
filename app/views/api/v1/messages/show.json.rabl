object @message

attributes :id, :content, :topic_id
child(:user) { attributes :id, :first_name, :last_name, :email }