require 'rails_helper'

describe User do
  let!(:computacao)       { FactoryGirl.create(:course, name: 'Tecnologia em Sistemas de Computação') }
  let!(:pedagogia)        { FactoryGirl.create(:course, name: 'Pedagogia') }
  let!(:pda)              { FactoryGirl.create(:discipline, name: 'PDA', description: 'some description', course: computacao) }
  let!(:cpw)              { FactoryGirl.create(:discipline, name: 'CPW', description: 'some description', course: computacao) }
  let!(:paulo_freire)     { FactoryGirl.create(:discipline, name: 'Paulo Freire', description: 'some description', course: pedagogia) }
  let!(:user)             { FactoryGirl.create(:user, course: computacao) }
  let!(:another_user)     { FactoryGirl.create(:user, course: computacao, email: 'furingo@email.com') }
  let!(:user_discipline)  { FactoryGirl.create(:user_discipline, status: 'doing', discipline: cpw, user: user) }
  let!(:user_discipline2) { FactoryGirl.create(:user_discipline, status: 'incomplete', discipline: pda, user: user) }
  let!(:user_discipline3) { FactoryGirl.create(:user_discipline, status: 'doing', discipline: pda, user: another_user) }
  let!(:user_discipline4) { FactoryGirl.create(:user_discipline, status: 'doing', discipline: cpw, user: another_user) }

  describe :attributes do
    it { expect(user).to have_attribute(:first_name) }
    it { expect(user).to have_attribute(:last_name) }
    it { expect(user).to have_attribute(:email) }
    it { expect(user).to have_attribute(:course_id) }
  end

  describe :relationships do
    it { expect(user).to respond_to(:api_keys) }
    it { expect(user).to respond_to(:course) }
    it { expect(user).to respond_to(:disciplines) }
    it { expect(user).to respond_to(:user_disciplines) }
    it { expect(user).to respond_to(:rooms) }
    it { expect(user).to respond_to(:groups) }
    it { expect(user).to respond_to(:room_requests) }
    it { expect(user).to respond_to(:room_sent_requests) }
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

    describe '#set_disciplines' do
      before do
        user.disciplines = []
      end

      it 'sets disciplines based on user course' do
        expect(user.disciplines).to match([])
        expect(user.course).to eql(computacao)
        user.set_disciplines
        expect(user.disciplines).to include(pda, cpw)
      end
    end

    describe '#current_disciplines' do
      it 'returns disciplines with doing status' do
        expect(user.current_disciplines).to include(cpw)
        expect(user.current_disciplines).not_to include(pda)
      end
    end

    describe '#common_disciplines_with' do
      it 'returns common disciplines with doing status' do
        expect(user.common_disciplines_with(another_user)).to include(cpw)
        expect(user.common_disciplines_with(another_user)).not_to include(pda)
      end
    end
  end
end
