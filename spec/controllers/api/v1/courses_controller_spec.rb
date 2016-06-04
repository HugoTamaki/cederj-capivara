require 'rails_helper'

describe Api::V1::CoursesController do
  render_views

  let!(:computacao) { FactoryGirl.create(:course, name: 'Tecnologia em Sistemas de Computacao') }
  let!(:pedagogia)  { FactoryGirl.create(:course, name: 'Pedagogia') }
  let!(:turismo)    { FactoryGirl.create(:course, name: 'Turismo') }

  describe 'GET #index' do
    context 'valid' do
      it 'sends all available courses' do
        get :index, format: :json

        expected_response = {
          courses: [
            {
              id: computacao.id,
              name: computacao.name
            },
            {
              id: pedagogia.id,
              name: pedagogia.name
            },
            {
              id: turismo.id,
              name: turismo.name
            }
          ]
        }

        expect(response.body).to eql(expected_response.to_json)
      end
    end
  end
end
