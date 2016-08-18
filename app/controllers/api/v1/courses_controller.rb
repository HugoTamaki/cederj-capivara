module Api
  module V1
    class CoursesController < ApplicationController
      respond_to :json

      skip_before_action :authenticate

      def index
        @courses = Course.all
      end
    end
  end
end

