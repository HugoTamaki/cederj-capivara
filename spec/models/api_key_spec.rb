require 'rails_helper'

describe ApiKey do
  let(:api_key) { FactoryGirl.create(:api_key) }

  describe :attributes do
    it { expect(api_key).to have_attribute(:secret) }
    it { expect(api_key).to have_attribute(:key) }
  end

  describe :relationships do
    it { expect(api_key).to respond_to(:user) }
  end

  describe :methods do
    describe '#token' do
      it 'token should be secret and key combined' do
        token = api_key.token
        expect(token).to eql("#{api_key.secret}:#{api_key.key}")
      end
    end

    describe '#expired?' do
      context 'token is expired' do
        it 'returns true' do
          api_key.expires_at = Time.now - 5.days
          expect(api_key.expired?).to eql(true)
        end
      end

      context 'token is not expired' do
        it 'returns false' do
          api_key.expires_at = Time.now + 7.days
          expect(api_key.expired?).to eql(false)
        end
      end
    end
  end
end
