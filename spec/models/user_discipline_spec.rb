require 'rails_helper'

describe UserDiscipline do
  let(:computacao) { FactoryGirl.create(:course, name: 'Tecnologia em Sistemas de Computação') }
  let(:discipline) { FactoryGirl.create(:discipline, course: computacao) }
  let(:user) { FactoryGirl.create(:user, course: computacao) }
  let(:user_discipline) { FactoryGirl.create(:user_discipline, user: user, discipline: discipline) }

  describe :attributes do
    it { expect(user_discipline).to have_attribute(:user_id) }
    it { expect(user_discipline).to have_attribute(:discipline_id) }
    it { expect(user_discipline).to have_attribute(:status) }
  end

  describe :relationships do
    it { expect(user_discipline).to respond_to(:user) }
    it { expect(user_discipline).to respond_to(:discipline) }
  end

  describe :validations do
    let(:user_discipline) { FactoryGirl.create(:user_discipline) }

    context :valid do
      it 'status is incomplete' do
        user_discipline.status = 'incomplete'
        expect(user_discipline.save).to eql(true)
      end

      it 'status is doing' do
        user_discipline.status = 'doing'
        expect(user_discipline.save).to eql(true)
      end

      it 'status is complete' do
        user_discipline.status = 'complete'
        expect(user_discipline.save).to eql(true)
      end
    end

    context :invalid do
      it 'status is anything else' do
        user_discipline.status = 'anything else'
        expect(user_discipline.save).to eql(false)
      end
    end
  end
end
