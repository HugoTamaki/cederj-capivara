class TopicPolicy < ApplicationPolicy
  class Scope < Scope
    attr_reader :user, :scope

    def initialize(user, scope)
      @user = user
      @scope = scope
    end

    def resolve
      scope.joins(:room).where(rooms: {id: @user.room_ids})
    end
  end

  attr_reader :user, :topic

  def initialize(user, topic)
    @user = user
    @topic = topic
  end

  def create?
    @user.room_ids.include? @topic.room.id
  end

  def update?
    @user.room_ids.include? @topic.room.id
  end

  def destroy?
    @user.room_ids.include? @topic.room.id
  end
end
