var Conf = {
  baseUrl: 'http://localhost:3000/api/v1/'
}

describe('CacheService', function() {
  var CacheService, localStorageService;

  beforeEach(module('capivara'));

  beforeEach(inject(function(_CacheService_, _localStorageService_) {
    CacheService = _CacheService_;
    localStorageService = _localStorageService_;
  }));

  describe('#get', function() {
    beforeEach(function() {
      localStorageService.set('SOME-ITEM', 'SOME-VALUE');
    });

    it('gets item from localStorage', function() {
      var value = CacheService.get('SOME-ITEM');
      expect(value).toEqual('SOME-VALUE');
    });
  });

  describe('#set', function() {
    beforeEach(function() {
      localStorageService.set('SOME-ITEM', null);
    });

    it('sets item to localStorage', function() {
      expect(localStorageService.get('SOME-ITEM')).toEqual(null);

      CacheService.set('SOME-ITEM', 'SOME-VALUE');

      expect(localStorageService.get('SOME-ITEM')).toEqual('SOME-VALUE');
    });
  });

  describe('#remove', function() {
    beforeEach(function() {
      localStorageService.set('SOME-ITEM', 'SOME-VALUE');
    });

    it('removes item from localStorage', function() {
      expect(localStorageService.get('SOME-ITEM')).toEqual('SOME-VALUE');

      CacheService.remove('SOME-ITEM');

      expect(localStorageService.get('SOME-ITEM')).toEqual(null);
    });
  });
});

describe('LabelService', function() {
  var LabelService;

  beforeEach(module('capivara'));

  beforeEach(inject(function(_LabelService_) {
    LabelService = _LabelService_;
  }));

  describe('#error', function() {
    describe('failed login', function() {
      it('shows Email ou senha errados.', function() {
        expect(LabelService.error.failedLogin).toEqual('Email ou senha errados.');
      });
    });
  });
});