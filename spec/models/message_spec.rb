require 'rails_helper'

describe Message do
  let(:user)  { FactoryGirl.create(:user) }
  let(:room)  { FactoryGirl.create(:room, user: user) }
  let(:topic) { FactoryGirl.create(:topic, room: room, user: user) }
  let(:message) { FactoryGirl.create(:message, topic: topic, user: user) }

  describe :attributes do
    it { expect(message).to have_attribute(:content) }
    it { expect(message).to have_attribute(:topic_id) }
    it { expect(message).to have_attribute(:user_id) }
  end

  describe :relationships do
    it { expect(message).to respond_to(:topic) }
    it { expect(message).to respond_to(:user) }
  end
end
