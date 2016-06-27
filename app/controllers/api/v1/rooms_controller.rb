module Api
  module V1
    class RoomsController < ApplicationController
      respond_to :json

      before_action :authenticate
      before_action :set_room, only: [:show, :update, :destroy]

      def index
        user = @api_key.user
        @rooms = user.rooms
      end

      def create
        user = @api_key.user
        @room = user.rooms.build(room_params)
        if @room.save
          @room
        else
          render json: { errors: @room.errors }, status: 400
        end
      end

      def show
        @room
      end

      def update
        if @room.update(room_params)
          @room
        else
          render json: { errors: @room.errors }, status: 400
        end
      end

      def destroy
        if @room.destroy
          @room
        else
          render json: { errors: @room.errors }, status: 400
        end
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

      def set_room
        @room = Room.find(params[:id])
      end

      def room_params
        params.require(:room).permit(:name, :public)
      end

      def render_unauthorized
        self.headers['WWW-Authenticate'] = 'Token realm="Application"'
        render json: {error: 'Not authorized'}, status: 401
      end
    end
  end
end
