class RoomEntryRequest < ActiveRecord::Base
  belongs_to :room
  belongs_to :sender, class_name: 'User'
  belongs_to :receiver, class_name: 'User'

  validates :room_id, presence: true
  validates :sender_id, presence: true
  validates :receiver_id, presence: true

  scope :not_accepted, -> { where(accepted: false) }
end
