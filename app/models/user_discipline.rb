class UserDiscipline < ActiveRecord::Base
  belongs_to :user
  belongs_to :discipline

  validates :status,
    inclusion: { in: %w(incomplete doing complete) },
    presence: true


  STATUSES = [
    'incomplete',
    'doing',
    'complete'
  ]
end
