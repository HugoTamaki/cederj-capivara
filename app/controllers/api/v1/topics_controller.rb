module Api
  module V1
    class TopicsController < ApplicationController
      respond_to :json

      before_action :authenticate
      before_action :set_room
      before_action :set_topic, only: [:show, :update, :destroy]

      def index
        @topics = TopicPolicy::Scope.new(@api_key.user, @room.topics).resolve
      end

      def create
        @topic = @room.topics.build(topic_params)
        @topic.user = @api_key.user

        authorize @topic

        if @topic.save
          @topic
        else
          render json: { errors: @topic.errors }, status: 400
        end
      end

      def update
        authorize @topic

        if @topic.update(topic_params)
          @topic
        else
          render json: { errors: @topic.errors }, status: 400
        end
      end

      def destroy
        authorize @topic
        if @topic.destroy
          @topic
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
        @topic = Topic.find(params[:id])
      end

      def topic_params
        params.require(:topic).permit(:name, :content)
      end

      def render_unauthorized
        self.headers['WWW-Authenticate'] = 'Token realm="Application"'
        render json: {error: 'Not authorized'}, status: 401
      end
    end
  end
end
