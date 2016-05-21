class Discipline < ActiveRecord::Base
  has_many :users, through: :user_disciplines
end
