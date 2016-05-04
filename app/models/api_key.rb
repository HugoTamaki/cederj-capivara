require 'securerandom'
class ApiKey < ActiveRecord::Base
  before_create :set_secret_and_token, :set_expiration
  belongs_to :user

  def token
    "#{self.secret}:#{self.key}"
  end

  def expired?
    Time.now > self.expires_at
  end

  def not_expired?
    Time.now < self.expires_at
  end

  private

  def set_secret_and_token
    self.secret = SecureRandom.uuid.gsub(/\-/,'')
    self.key = SecureRandom.uuid.gsub(/\-/,'')
  end

  def set_expiration
    self.expires_at = Time.now + 7.days
  end
end
