require 'rails_helper'

describe Api::V1::TopicsController do
  render_views

  let!(:computacao) { FactoryGirl.create(:course, name: 'Tecnologia em Sistemas de Computacao') }
  let!(:user)       { FactoryGirl.create(:user, email: 'johndoe@email.com', password: '123123123', password_confirmation: '123123123', course: computacao) }
  let!(:api_key)    { FactoryGirl.create(:api_key, user: user, expires_at: Time.now + 7.days) }
  let!(:room1)      { FactoryGirl.create(:room, user: user, name: 'Room 1', public: false) }
  let!(:topic1)     { FactoryGirl.create(:topic, name:'Topic title 1', content: 'lorem ipsum lari lara', room: room1) }
  let!(:topic2)     { FactoryGirl.create(:topic, name:'Topic title 2', content: 'lorem ipsum lari lara', room: room1) }
  let!(:topic3)     { FactoryGirl.create(:topic, name:'Topic title 3', content: 'lorem ipsum lari lara', room: room1) }

  describe '#GET index' do
    describe 'scope' do
      describe 'requests topics that user is owner' do
        it 'sends all topics from room' do
          request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

          get :index, room_id: room1.id, format: :json

          expected_response = {
            topics: [
              {
                id: topic1.id,
                name: topic1.name,
                content: topic1.content
              },
              {
                id: topic2.id,
                name: topic2.name,
                content: topic2.content
              },
              {
                id: topic3.id,
                name: topic3.name,
                content: topic3.content
              }
            ]
          }

          expect(response.body).to eql(expected_response.to_json)
          expect(response.status).to eql(200)
        end
      end

      describe 'requests topics from a room that a user belongs to' do
        xit 'sends all topics from room' do
          pending 'TODO'
        end
      end

      describe 'requests topics from a room which the user is not owner nor belongs' do
        xit 'sends no topics at all' do
          pending 'TODO'
        end
      end
    end
  end

  describe '#POST create' do
    context 'valid' do
      it 'creates a valid topic' do
        request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

        params = {
          name: 'My topic',
          content: 'lorem ipsum lala'
        }

        expect(room1.topics.size).to eql(3)

        post :create, room_id: room1.id, topic: params, format: :json

        topic = Topic.last

        expected_response = {
          topic: {
            id: topic.id,
            name: topic.name,
            content: topic.content
          }
        }

        expect(response.body).to eql(expected_response.to_json)
        expect(room1.reload.topics.size).to eql(4)
      end
    end
  end
end
