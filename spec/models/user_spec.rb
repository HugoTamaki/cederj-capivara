require 'rails_helper'

describe User do
  let(:user) { FactoryGirl.create(:user) }

  describe :attributes do
    it { expect(user).to have_attribute(:first_name) }
    it { expect(user).to have_attribute(:last_name) }
    it { expect(user).to have_attribute(:email) }
  end

  describe :relationships do
    it { expect(user).to respond_to(:api_keys) }
    it { expect(user).to respond_to(:disciplines) }
    it { expect(user).to respond_to(:user_disciplines) }
  end

  describe :creation do
    let!(:pda) { FactoryGirl.create(:discipline, name: 'PDA', description: 'some description') }
    let!(:cpw) { FactoryGirl.create(:discipline, name: 'CPW', description: 'some description') }
    let!(:user_creation) { FactoryGirl.create(:user, email: 'loremipsum@email.com') }

    it 'user should have all disciplines' do
      expect(user.disciplines).to include(pda, cpw)
    end

    it 'user disciplines should all be incomplete' do
      expect(user.disciplines.pluck(:status)).to eql(['incomplete', 'incomplete'])
    end
  end

  describe :methods do
    describe '#set_api_key' do
      it 'user should have new ApiKey' do
        expect(ApiKey.count).to eql(0)
        api_key = user.set_api_key
        expect(ApiKey.count).to eql(1)
        expect(api_key.user).to eql(user)
      end
    end
  end
end
