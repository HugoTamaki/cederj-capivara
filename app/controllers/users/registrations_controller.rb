class Users::RegistrationsController < Devise::RegistrationsController
  before_filter :configure_permitted_parameters, if: :devise_controller?
  skip_before_filter :verify_authenticity_token, :only => :create
  respond_to :json

  # POST /resource
  def create
    build_resource(sign_up_params)

    resource.save
    yield resource if block_given?
    if resource.persisted?
      api_key = resource.set_api_key

      render json: format_response(resource, api_key)
    else
      clean_up_passwords resource
      set_minimum_password_length
      render json: {error: resource.errors}
    end
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:first_name, :last_name, :email, :password, :password_confirmation])
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