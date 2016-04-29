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
      if resource.active_for_authentication?
        sign_up(resource_name, resource)
        api_key = resource.set_api_key

        render json: {user: resource, api_key: {token: api_key.token}}
      else
        expire_data_after_sign_in!
        respond_with resource
      end
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
end