class Discipline < ActiveRecord::Base
  belongs_to :course
  has_many :users, through: :user_disciplines
  has_many :user_disciplines

  scope :in_progress_from, -> (user) { joins(:user_disciplines).where(user_disciplines: {user: user, status: 'doing'}) }
end
