class Users::SessionsController < Devise::SessionsController
  skip_before_filter :verify_authenticity_token, :only => :create
  respond_to :json

  # POST /resource/sign_in
  def create
    resource = User.find_by(email: params[:api_v1_user][:email])
    if resource.valid_password?(params[:api_v1_user][:password])
      api_key = renew_api_key(resource)
      render json: {user: resource, api_key: {token: api_key.token}}
    else
      render json: {error: 'email or password is wrong'}, status: 404
    end
  end

  private

  def renew_api_key(resource)
    api_key = resource.api_keys.last
    if api_key.expired?
      api_key.destroy
      api_key = resource.set_api_key
    end
    api_key
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
end