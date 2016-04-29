require 'securerandom'
class ApiKey < ActiveRecord::Base
  before_create :set_secret_and_token
  belongs_to :user

  private

  def set_secret_and_token
    self.secret = SecureRandom.uuid.gsub(/\-/,'')
    self.key = SecureRandom.uuid.gsub(/\-/,'')
  end
end
