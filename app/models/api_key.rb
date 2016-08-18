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

  class << self
    def valid?(secret, key)
      api_key = self.find_by(secret: secret, key: key)
      if api_key && api_key.not_expired?
        api_key
      end
    end
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
