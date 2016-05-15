class Users::RegistrationsController < Devise::RegistrationsController
  before_filter :configure_permitted_parameters, if: :devise_controller?
  skip_before_filter :verify_authenticity_token, :only => [:create]
  skip_before_filter :authenticate_scope!, only: [:update]
  respond_to :json

  before_action :authenticate, only: [:update]

  # POST /resource
  def create
    build_resource(sign_up_params)

    if resource.save
      api_key = resource.set_api_key
      render json: format_response(resource, api_key), status: 200
    else
      render json: {error: resource.errors}, status: 400
    end
  end

  def update
    resource = get_resource
    resource_updated = update_resource(resource, account_update_params)
    if resource_updated
      render json: format_response(resource, @api_key), status: 200
    else
      render json: {error: resource.errors}, status: 400
    end
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:first_name, :last_name, :email, :password, :password_confirmation])
    devise_parameter_sanitizer.permit(:account_update, keys: [:first_name, :last_name, :password, :password_confirmation, :current_password])
  end

  def format_response(resource, api_key)
    {
      user: {
        first_name: resource.first_name,
        last_name: resource.last_name,
        email: resource.email
      },
      api_key: api_key.token
    }
  end

  def authenticate
    authenticate_token || render_unauthorized
  end

  def authenticate_token
    authenticate_with_http_token do |token, options|
      secret, key = token.split(':')
      @api_key = ApiKey.find_by(secret: secret, key: key)
      @api_key && @api_key.not_expired? ? true : false
    end
  end

  def get_resource
    @api_key.user
  end

  def render_unauthorized
    self.headers['WWW-Authenticate'] = 'Token realm="Application"'
    render json: {error: 'Bad credentials'}, status: 401
  end
end