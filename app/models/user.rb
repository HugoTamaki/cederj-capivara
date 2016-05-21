class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  has_many :api_keys, dependent: :destroy
  has_many :user_disciplines
  has_many :disciplines, through: :user_disciplines
  accepts_nested_attributes_for :user_disciplines

  validates :first_name, presence: true
  validates :last_name, presence: true

  before_create :set_disciplines

  def set_api_key
    self.api_keys.create
  end

  private

  def set_disciplines
    disciplines = Discipline.all

    disciplines.each do |discipline|
      self.disciplines << discipline
    end
  end
end
