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

  attr_reader :user, :message

  def initialize(user, message)
    @user = user
    @message = message
  end

  def index?
    message_belongs_to_user?
  end

  def create?
    message_belongs_to_user?
  end

  private

  def message_belongs_to_user?
    @user.room_ids.include? @message.topic.room.id
  end
end
