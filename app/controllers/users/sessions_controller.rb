class Users::SessionsController < Devise::SessionsController
  skip_before_filter :verify_authenticity_token, :only => [:create, :destroy]
  skip_before_filter :verify_signed_out_user
  respond_to :json

  before_action :authenticate, only: [:destroy]

  # POST /resource/sign_in
  def create
    resource = User.find_by(email: params[:user][:email])
    if resource && resource.valid_password?(params[:user][:password])
      api_key = resource.set_api_key
      render json: format_response(resource, api_key)
    else
      render json: {error: 'email or password is wrong'}, status: 404
    end
  end

  # DELETE /resource/sign_out
  def destroy
    if @api_key.destroy
      render json: {message: 'Session cleared'}, status: 200
    else
      render json: {message: 'Internal server error'}, status: 500
    end
  end

  private

  def format_response(resource, api_key)
    user_disciplines = resource.user_disciplines
    disciplines_hash = prepare_disciplines(user_disciplines)

    {
      user: {
        id: resource.id,
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

  protected

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

  def render_unauthorized
    self.headers['WWW-Authenticate'] = 'Token realm="Application"'
    render json: {error: 'Bad credentials'}, status: 401
  end
end