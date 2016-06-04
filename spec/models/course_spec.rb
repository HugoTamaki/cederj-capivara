require 'rails_helper'

describe Course do
  let!(:course) { FactoryGirl.create(:course) }
  let!(:discipline) { FactoryGirl.create(:discipline, course: course) }
  let!(:user) { FactoryGirl.create(:user, course: course) }

  describe :attributes do
    it { expect(course).to have_attribute(:name) }
  end

  describe :relationships do
    it { expect(course).to respond_to(:users) }
    it { expect(course).to respond_to(:disciplines) }
  end
end
