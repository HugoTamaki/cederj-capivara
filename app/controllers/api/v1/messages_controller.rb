module Api
  module V1
    class MessagesController < ApplicationController
      respond_to :json

      before_action :authenticate
      before_action :set_room, :set_topic
      before_action :set_message, only: [:show, :update, :destroy]

      def index
        @message = Message.new(topic_id: @topic.id)
        authorize @message
        @messages = @topic.messages
        @user = @api_key.user
      end

      def create
        @message = @topic.messages.build(message_params)

        authorize @message

        @message.user = @api_key.user
        @user = @api_key.user

        if @message.save
          @message
        else
          render json: { errors: @topic.errors }, status: 400
        end
      end

      private

      def pundit_user
        @api_key.user
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

      def set_room
        @room = Room.find(params[:room_id])
      end

      def set_topic
        @topic = Topic.find(params[:topic_id])
      end

      def set_message
        @message = Message.find(params[:id])
      end

      def message_params
        params.require(:message).permit(:content)
      end

      def render_unauthorized
        self.headers['WWW-Authenticate'] = 'Token realm="Application"'
        render json: {error: 'Not authorized'}, status: 401
      end
    end
  end
end
