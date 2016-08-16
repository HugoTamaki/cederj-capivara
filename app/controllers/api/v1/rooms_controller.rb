module Api
  module V1
    class RoomsController < ApplicationController
      respond_to :json

      before_action :set_room, only: [:show, :update, :destroy]

      def index
        user = @api_key.user
        @rooms = user.rooms
      end

      def participating_rooms
        user = @api_key.user
        @participating_rooms = user.groups
      end

      def search
        @rooms = Room.first(5) unless params[:term]
        @rooms = Room.where("LOWER(name) LIKE ?", "%#{params[:term].downcase}%") if params[:term]
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

      def set_room
        @room = Room.find(params[:id])
      end

      def room_params
        params.require(:room).permit(:name, :public)
      end
    end
  end
end
