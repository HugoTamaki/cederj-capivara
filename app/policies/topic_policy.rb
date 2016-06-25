class TopicPolicy < ApplicationPolicy
  class Scope < Scope
    attr_reader :user, :scope

    def initialize(user, scope)
      @user = user
      @scope = scope
    end

    def resolve
      room_ids = get_room_ids(@user)
      scope.joins(:room).where(rooms: {id: room_ids})
    end

    private

    def get_room_ids(user)
      user_rooms = user.rooms.pluck(:id)
      user_groups = user.groups.pluck(:id)
      [user_rooms, user_groups].flatten.uniq
    end
  end

  attr_reader :user, :topic

  def initialize(user, topic)
    @user = user
    @topic = topic
  end

  def create?
    room_ids = get_room_ids(@user)
    room_ids.include? @topic.room.id
  end

  private

  def get_room_ids(user)
    user_rooms = user.rooms.pluck(:id)
    user_groups = user.groups.pluck(:id)
    [user_rooms, user_groups].flatten.uniq
  end
end
