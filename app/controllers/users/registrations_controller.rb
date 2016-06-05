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
      resource.set_disciplines
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

  def format_response(resource, api_key)
    user_disciplines = resource.user_disciplines
    disciplines_hash = prepare_disciplines(user_disciplines)

    {
      user: {
        first_name: resource.first_name,
        last_name: resource.last_name,
        email: resource.email,
        disciplines: disciplines_hash
      },
      api_key: api_key.token
    }
  end

  def prepare_disciplines(user_disciplines)
    response = []

    user_disciplines.each do |user_discipline|
      response << {
        id: user_discipline.discipline.id,
        ud_id: user_discipline.id,
        name: user_discipline.discipline.name,
        description: user_discipline.discipline.description,
        status: user_discipline.status
      }
    end

    response
  end

  def update_resource(resource, params)
    if params[:password] || params[:password_confirmation]
      resource.update_with_password(params)
    else
      resource.update_without_password(params)
    end
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

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up,
      keys: [:first_name, :last_name, :email, :password, :password_confirmation, :course_id]
    )
    devise_parameter_sanitizer.permit(:account_update,
      keys: [:first_name, :last_name, :password, :password_confirmation, :current_password,
        user_disciplines_attributes: [:id, :status]
      ]
    )
  end
end