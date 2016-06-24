class RoomUser < ActiveRecord::Base
  belongs_to :participant, foreign_key: :user_id, class_name: 'User'
  belongs_to :group, foreign_key: :room_id, class_name: 'Room'
end
