class RoomEntryRequest < ActiveRecord::Base
  belongs_to :room
  belongs_to :sender, class_name: 'User'
  belongs_to :receiver, class_name: 'User'
end
