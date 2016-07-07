class Topic < ActiveRecord::Base
  belongs_to :room
  belongs_to :user
  has_many :messages, dependent: :destroy
end
