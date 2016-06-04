class Discipline < ActiveRecord::Base
  belongs_to :course
  has_many :users, through: :user_disciplines
end
