module Api
  module V1
    class UsersController < ApplicationController
      respond_to :json

      before_action :set_user, only: [:show]

      def index
        @users = User.all
        @users = @users.where("first_name LIKE ?", "%#{params[:term]}%") if params[:term]
      end

      def show
        @user
      end

      private

      def set_user
        @user = User.find(params[:id])
      end
    end
  end
end
