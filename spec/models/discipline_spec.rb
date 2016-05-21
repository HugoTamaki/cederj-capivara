require 'rails_helper'

describe Discipline do
  let(:user) { FactoryGirl.create(:user) }
  let(:discipline) { FactoryGirl.create(:discipline) }
  let(:user_disciplines) { FactoryGirl.create(:user_disciplines, user: user, discipline: discipline) }

  describe :attributes do
    it { expect(discipline).to have_attribute(:name) }
    it { expect(discipline).to have_attribute(:description) }
  end

  describe :relationships do
    it { expect(discipline).to respond_to(:users) }
  end
end
