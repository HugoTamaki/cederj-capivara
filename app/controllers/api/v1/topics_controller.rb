module Api
  module V1
    class TopicsController < ApplicationController
      respond_to :json

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

      def set_room
        @room = Room.find(params[:room_id])
      end

      def set_topic
        @topic = Topic.find(params[:id])
      end

      def topic_params
        params.require(:topic).permit(:name, :content)
      end
    end
  end
end
