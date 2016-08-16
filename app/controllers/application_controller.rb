class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  include Pundit

  before_action :authenticate

  protect_from_forgery with: :null_session

  rescue_from Pundit::NotAuthorizedError, with: :not_authorized
  rescue_from ::ActiveRecord::RecordNotFound, with: :record_not_found

  private

  def not_authorized
    render json: { error: 'Forbidden' }, status: 403
  end

  def record_not_found(exception)
    render json: { error: exception.message }.to_json, status: 404
    return
  end

  def authenticate
    authenticate_token || render_unauthorized
  end

  def authenticate_token
    authenticate_with_http_token do |token, options|
      secret, key = token.split(':')
      @api_key = ApiKey.valid?(secret, key)
    end
  end

  def render_unauthorized
    self.headers['WWW-Authenticate'] = 'Token realm="Application"'
    render json: {error: 'Not authorized'}, status: 401
  end
end
