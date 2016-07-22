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
  end

  describe :relationships do
    it { expect(room_entry_request).to respond_to(:room) }
    it { expect(room_entry_request).to respond_to(:sender) }
    it { expect(room_entry_request).to respond_to(:receiver) }
  end
end
