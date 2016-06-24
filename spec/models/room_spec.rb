require 'rails_helper'

describe Room do
  let(:user) { FactoryGirl.create(:user) }
  let(:room) { FactoryGirl.create(:room) }

  describe :attributes do
    it { expect(room).to have_attribute(:name) }
    it { expect(room).to have_attribute(:public) }
    it { expect(room).to have_attribute(:user_id) }
  end

  describe :relationships do
    it { expect(room).to respond_to(:user) }
    it { expect(room).to respond_to(:participants) }
  end
end
