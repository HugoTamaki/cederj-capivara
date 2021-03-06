module Api
  module V1
    class RoomEntryRequestsController < ApplicationController
      respond_to :json

      def index
        @user = @api_key.user
        @invitations = @user.room_requests.not_accepted
      end

      def sent_requests
        @user = @api_key.user
        @invitations = @user.room_sent_requests
        @invitations = @invitations.where(room_id: params[:room_id]) if params[:room_id]
      end

      def create
        receiver = User.find_by(id: params[:room_entry_request][:receiver_id])
        room = Room.find_by(id: params[:room_entry_request][:room_id])
        sender = @api_key.user

        @room_entry_request = RoomEntryRequest.new(room: room, sender: sender, receiver: receiver)

        if @room_entry_request.save
          @room_entry_request
        else
          render json: { errors: @room_entry_request.errors }, status: 400
        end
      end

      def accept
        @room_entry_request = RoomEntryRequest.find(params[:id])

        sender = @room_entry_request.sender
        room = @room_entry_request.room

        @room_entry_request.update(accepted: true)
        room.participants << sender
        @room_entry_request
      end
    end
  end
end
