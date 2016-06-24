require 'rails_helper'

describe RoomUser do
  let!(:user) { FactoryGirl.create(:user) }
  let!(:room) { FactoryGirl.create(:room) }
  let!(:room_user) { FactoryGirl.create(:room_user, user_id: user.id, room_id: room.id) }

  describe :attributes do
    it { expect(room).to have_attribute(:user_id) }
  end

  describe :relationships do
    it { expect(room).to respond_to(:user) }
    it { expect(room).to respond_to(:participants) }
  end

  describe :methods do
    describe '#participant' do
      it 'returns participant of room_user' do
        expect(room_user.participant).to eql(user)
      end
    end

    describe '#room' do
      it 'returns room of room_user' do
        expect(room_user.room).to eql(room)
      end
    end
  end
end
