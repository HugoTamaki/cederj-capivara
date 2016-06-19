module Api
  module V1
    class RoomsController < ApplicationController
      respond_to :json

      before_action :authenticate
      before_action :set_user

      def index
        @rooms = @user.rooms
      end

      private

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

      def set_user
        @user = User.find(params[:user_id])
      end

      def render_unauthorized
        self.headers['WWW-Authenticate'] = 'Token realm="Application"'
        render json: {error: 'Bad credentials'}, status: 401
      end
    end
  end
end
