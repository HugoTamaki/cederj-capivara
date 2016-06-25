require 'rails_helper'

describe Api::V1::TopicsController do
  render_views

  let!(:computacao)  { FactoryGirl.create(:course, name: 'Tecnologia em Sistemas de Computacao') }
  let!(:user)        { FactoryGirl.create(:user, email: 'johndoe@email.com', password: '123123123', password_confirmation: '123123123', course: computacao) }
  let!(:api_key)     { FactoryGirl.create(:api_key, user: user, expires_at: Time.now + 7.days) }
  let!(:room1)       { FactoryGirl.create(:room, user: user, name: 'Room 1', public: false) }
  let!(:topic1)      { FactoryGirl.create(:topic, name:'Topic title 1', content: 'lorem ipsum lari lara', room: room1) }
  let!(:topic2)      { FactoryGirl.create(:topic, name:'Topic title 2', content: 'lorem ipsum lari lara', room: room1) }
  let!(:topic3)      { FactoryGirl.create(:topic, name:'Topic title 3', content: 'lorem ipsum lari lara', room: room1) }
  let!(:user2)       { FactoryGirl.create(:user, email: 'janedoe@email.com', password: '123123123', password_confirmation: '123123123', course: computacao) }
  let!(:room2)       { FactoryGirl.create(:room, user: user2, name: 'Room 2', public: false) }
  let!(:topic4)      { FactoryGirl.create(:topic, name:'Topic title 4', content: 'lorem ipsum lari lara', room: room2) }
  let!(:topic5)      { FactoryGirl.create(:topic, name:'Topic title 5', content: 'lorem ipsum lari lara', room: room2) }
  let!(:topic6)      { FactoryGirl.create(:topic, name:'Topic title 6', content: 'lorem ipsum lari lara', room: room2) }

  describe '#GET index' do
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

        expect(user.rooms).to include(room1)
        expect(response.body).to eql(expected_response.to_json)
        expect(response.status).to eql(200)
      end
    end

    describe 'requests topics from a room that a user belongs to' do
      before :each do
        room2.participants << user
      end

      it 'sends all topics from room' do
        request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

        get :index, room_id: room2.id, format: :json

        expected_response = {
          topics: [
            {
              id: topic4.id,
              name: topic4.name,
              content: topic4.content
            },
            {
              id: topic5.id,
              name: topic5.name,
              content: topic5.content
            },
            {
              id: topic6.id,
              name: topic6.name,
              content: topic6.content
            }
          ]
        }

        expect(room2.participants).to include(user)
        expect(response.body).to eql(expected_response.to_json)
        expect(response.status).to eql(200)
      end
    end

    describe 'requests topics from a room which the user is not owner nor belongs' do
      it 'sends no topics at all' do
        request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

        get :index, room_id: room2.id, format: :json

        expected_response = {
          topics: []
        }

        expect(room2.participants).to match([])
        expect(response.body).to eql(expected_response.to_json)
        expect(response.status).to eql(200)
      end
    end
  end

  describe '#POST create' do
    describe 'topic for room owned by user' do
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

    describe 'topic for room user is participating' do
      before :each do
        room2.participants << user
      end

      it 'creates a valid topic' do
        request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

        params = {
          name: 'My topic',
          content: 'lorem ipsum lala'
        }

        expect(room2.topics.size).to eql(3)

        post :create, room_id: room2.id, topic: params, format: :json

        topic = Topic.last

        expected_response = {
          topic: {
            id: topic.id,
            name: topic.name,
            content: topic.content
          }
        }

        expect(room2.reload.topics.size).to eql(4)
        expect(room2.participants).to include(user)
        expect(response.body).to eql(expected_response.to_json)
        expect(response.status).to eql(200)
      end
    end

    describe 'topic for room not owned or participating by user' do
      it 'cant create topic' do
        request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

        params = {
          name: 'My topic',
          content: 'lorem ipsum lala'
        }

        expect(room2.topics.size).to eql(3)

        post :create, room_id: room2.id, topic: params, format: :json

        topic = Topic.last

        expected_response = {
          error: 'Not authorized'
        }

        expect(room2.reload.topics.size).to eql(3)
        expect(room2.participants).not_to include(user)
        expect(response.body).to eql(expected_response.to_json)
        expect(response.status).to eql(401)
      end
    end
  end
end
