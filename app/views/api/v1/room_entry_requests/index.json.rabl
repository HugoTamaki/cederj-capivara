collection @invitations, root: 'room_entry_requests', object_root: false

attributes :id, :sender_id, :receiver_id, :accepted
child :room do
  extends 'api/v1/rooms/show'
end