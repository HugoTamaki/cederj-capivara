object @room_entry_request

attributes :id, :accepted
child :sender => :sender do
  attributes :id, :first_name, :last_name, :email
end
child :receiver => :receiver do
  attributes :id, :first_name, :last_name, :email
end
child :room do
  extends 'api/v1/rooms/show'
end