class TopicPolicy < ApplicationPolicy
  class Scope < Scope
    attr_reader :user, :scope

    def initialize(user, scope)
      @user = user
      @scope = scope
    end

    def resolve
      rooms = @user.rooms.pluck(:id)
      groups = @user.groups.pluck(:id)
      ids = [rooms, groups].flatten.uniq
      
      scope.joins(:room).where(rooms: {id: ids})
    end
  end
end
