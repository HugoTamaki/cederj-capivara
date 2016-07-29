object @room_entry_request

attributes :id, :sender_id, :receiver_id, :accepted
child :room do
  extends 'api/v1/rooms/show'
end