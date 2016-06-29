class MessagePolicy < ApplicationPolicy
  class Scope < Scope
    attr_reader :user, :scope

    def initialize(user, scope)
      @user = user
      @scope = scope
    end

    def resolve
      scope.joins(:topic).where("topics.room_id in (?) ", @user.room_ids)
    end
  end
end
