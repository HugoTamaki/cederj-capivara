class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  has_many :api_keys, dependent: :destroy

  validates :first_name, presence: true
  validates :last_name, presence: true

  def set_api_key
    self.api_keys.create
  end
end
