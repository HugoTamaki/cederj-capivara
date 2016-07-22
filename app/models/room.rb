class Room < ActiveRecord::Base
  belongs_to :user
  has_many :topics, dependent: :destroy
  has_many :room_users
  has_many :participants, through: :room_users, class_name: 'User'
  has_many :room_entry_requests

  validates :name, presence: true
end
