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

  def index?
    room_belongs_to_user?
  end

  def create?
    room_belongs_to_user?
  end

  def update?
    room_belongs_to_user?
  end

  def destroy?
    room_belongs_to_user?
  end

  private

  def room_belongs_to_user?
    @user.room_ids.include? @topic.room.id
  end
end
