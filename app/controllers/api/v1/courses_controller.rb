module Api
  module V1
    class CoursesController < ApplicationController
      respond_to :json

      def index
        @courses = Course.all
      end
    end
  end
end

