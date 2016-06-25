require 'rails_helper'

describe Topic do
  let(:user) { FactoryGirl.create(:user) }
  let(:room) { FactoryGirl.create(:room, user: user) }
  let(:topic) { FactoryGirl.create(:topic, room: room, user: user) }

  describe :attributes do
    it { expect(topic).to have_attribute(:name) }
    it { expect(topic).to have_attribute(:content) }
    it { expect(topic).to have_attribute(:room_id) }
    it { expect(topic).to have_attribute(:user_id) }
  end

  describe :relationships do
    it { expect(topic).to respond_to(:room) }
    it { expect(topic).to respond_to(:user) }
  end
end
