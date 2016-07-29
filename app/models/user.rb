class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  belongs_to :course
  has_many :api_keys, dependent: :destroy
  has_many :rooms
  has_many :topics
  has_many :messages
  has_many :room_users
  has_many :room_requests, class_name: 'RoomEntryRequest', foreign_key: 'receiver_id'
  has_many :room_sent_requests, class_name: 'RoomEntryRequest', foreign_key: 'sender_id'
  has_many :groups, through: :room_users, class_name: 'Room'
  has_many :user_disciplines
  has_many :disciplines, through: :user_disciplines
  accepts_nested_attributes_for :user_disciplines

  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :course_id, presence: true

  def set_api_key
    self.api_keys.create
  end

  def set_disciplines
    disciplines = self.course.disciplines

    disciplines.each do |discipline|
      self.disciplines << discipline
    end
  end

  def room_ids
    user_rooms = self.rooms.pluck(:id)
    user_groups = self.groups.pluck(:id)
    accepted_rooms = self.room_sent_requests.where(accepted: true).pluck(:room_id)
    [user_rooms, user_groups, accepted_rooms].flatten.uniq
  end
end
