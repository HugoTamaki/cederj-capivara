require 'rails_helper'

describe Api::V1::UsersController do
  render_views

  let!(:computacao) { FactoryGirl.create(:course, name: 'Tecnologia em Sistemas de Computacao') }
  let!(:john)       { FactoryGirl.create(:user, course: computacao) }
  let!(:jane)       { FactoryGirl.create(:user, first_name: 'Jane', last_name: 'Doe', email: 'janedoe@email.com', password: '123123123', password_confirmation: '123123123', course: computacao) }
  let!(:jake)       { FactoryGirl.create(:user, first_name: 'Jake', last_name: 'Johnson', email: 'jakejohnson@email.com', password: '123123123', password_confirmation: '123123123', course: computacao ) }
  let!(:api_key)    { FactoryGirl.create(:api_key, user: john, expires_at: Time.now + 7.days) }

  describe 'GET #index' do
    context 'valid' do
      it 'sends all users' do
        request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

        get :index, format: :json

        expected_response = {
          users: [
            {
              id: john.id,
              first_name: john.first_name,
              last_name: john.last_name,
              email: john.email,
              course_id: john.course_id
            },
            {
              id: jane.id,
              first_name: jane.first_name,
              last_name: jane.last_name,
              email: jane.email,
              course_id: jane.course_id
            },
            {
              id: jake.id,
              first_name: jake.first_name,
              last_name: jake.last_name,
              email: jake.email,
              course_id: jake.course_id
            }
          ]
        }

        expect(response.body).to eql(expected_response.to_json)
        expect(response.status).to eql(200)
      end

      it 'sends users which corresponds to term' do
        request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

        get :index, term: 'John', format: :json

        expected_response = {
          users: [
            {
              id: john.id,
              first_name: john.first_name,
              last_name: john.last_name,
              email: john.email,
              course_id: john.course_id
            }
          ]
        }
      end
    end

    context 'invalid' do
      before do
        api_key.expires_at = Time.now - 7.days
        api_key.save
      end

      it 'api_key is invalid' do
        request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

        get :index, format: :json

        expected_response = {
          error: 'Not authorized'
        }

        expect(response.body).to eql(expected_response.to_json)
        expect(response.status).to eql(401)
      end
    end
  end

  describe 'GET #show' do
    context 'valid' do
      it 'gets one user' do
        request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

        get :show, id: john.id, format: :json

        expected_response = {
          user: {
            id: john.id,
            first_name: john.first_name,
            last_name: john.last_name,
            email: john.email,
            course: {
              id: john.course.id,
              name: john.course.name
            }
          }
        }

        expect(response.body).to eql(expected_response.to_json)
        expect(response.status).to eql(200)
      end
    end

    context 'invalid' do
      before do
        api_key.expires_at = Time.now - 7.days
        api_key.save
      end

      it 'api_key is invalid' do
        request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

        get :show, id: john.id, format: :json

        expected_response = {
          error: 'Not authorized'
        }

        expect(response.body).to eql(expected_response.to_json)
        expect(response.status).to eql(401)
      end
    end
  end
end
