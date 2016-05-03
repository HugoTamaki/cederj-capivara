class Users::SessionsController < Devise::SessionsController
  skip_before_filter :verify_authenticity_token, :only => [:create, :destroy]
  skip_before_filter :verify_signed_out_user
  respond_to :json

  before_action :authenticate, only: [:destroy]

  # POST /resource/sign_in
  def create
    resource = User.find_by(email: params[:api_v1_user][:email])
    if resource && resource.valid_password?(params[:api_v1_user][:password])
      api_key = resource.set_api_key
      render json: format_response(resource, api_key)
    else
      render json: {error: 'email or password is wrong'}, status: 404
    end
  end

  # DELETE /resource/sign_out
  def destroy
    # find and destroy ApiKey
  end

  private

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

  protected

  def authenticate
    authenticate_token || render_unauthorized
  end

  def authenticate_token
    authenticate_with_http_token do |token, options|

    end
  end

  def render_unauthorized
    self.headers['WWW-Authenticate'] = 'Token realm="Application"'
    render json: 'Bad credentials', status: 401
  end
end