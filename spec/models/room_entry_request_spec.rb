require 'rails_helper'

describe RoomEntryRequest do
  let!(:computacao) { FactoryGirl.create(:course, name: 'Tecnologia em Sistemas de Computacao') }
  let!(:sender)     { FactoryGirl.create(:user, email: 'johndoe@email.com', password: '123123123', password_confirmation: '123123123', course: computacao) }
  let!(:receiver)    { FactoryGirl.create(:user, email: 'janedoe@email.com', password: '123123123', password_confirmation: '123123123', course: computacao) }
  let!(:room)      { FactoryGirl.create(:room, user: receiver, name: 'Room 1', public: false) }

  let(:room_entry_request) { FactoryGirl.create(:room_entry_request, sender: sender, receiver: receiver, room: room) }

  describe :attributes do
    it { expect(room_entry_request).to have_attribute(:sender_id) }
    it { expect(room_entry_request).to have_attribute(:receiver_id) }
    it { expect(room_entry_request).to have_attribute(:room_id) }
    it { expect(room_entry_request).to have_attribute(:accepted) }
    it { expect(room_entry_request).to have_attribute(:token) }
  end

  describe :relationships do
    it { expect(room_entry_request).to respond_to(:room) }
    it { expect(room_entry_request).to respond_to(:sender) }
    it { expect(room_entry_request).to respond_to(:receiver) }
  end

  describe :validations do
    context :valid do
      describe 'All params are there' do
        it 'Creates successfully room_entry_request' do
          room_entry_request.sender = sender
          room_entry_request.receiver = receiver
          room_entry_request.room = room

          expect(room_entry_request.save).to eql(true)
          expect(room_entry_request.room).to eql(room)
          expect(room_entry_request.sender).to eql(sender)
          expect(room_entry_request.receiver).to eql(receiver)
        end
      end
    end

    context :invalid do
      describe 'It lacks room_id' do
        it 'fails room_entry_request creation' do
          room_entry_request.sender = sender
          room_entry_request.receiver = receiver
          room_entry_request.room = nil

          expect(room_entry_request.save).to eql(false)
        end
      end

      describe 'It lacks sender_id' do
        it 'fails room_entry_request creation' do
          room_entry_request.sender = nil
          room_entry_request.receiver = receiver
          room_entry_request.room = room

          expect(room_entry_request.save).to eql(false)
        end
      end

      describe 'It lacks receiver_id' do
        it 'fails room_entry_request creation' do
          room_entry_request.sender = sender
          room_entry_request.receiver = nil
          room_entry_request.room = room

          expect(room_entry_request.save).to eql(false)
        end
      end
    end
  end
end
