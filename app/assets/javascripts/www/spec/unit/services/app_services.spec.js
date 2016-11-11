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
    it('failedLogin', function() {
      expect(LabelService.error.failedLogin).toEqual('Email ou senha errados.');
    });

    it('somethingWrong', function() {
      expect(LabelService.error.somethingWrong).toEqual('Alguma coisa aconteceu, tente novamente mais tarde.');
    });

    it('alreadyToken', function() {
      expect(LabelService.error.alreadyTaken).toEqual('Já existe um usuário com este email.');
    });
  });

  describe('#notification', function() {
    describe('profileEdit', function() {
      it('success', function() {
        expect(LabelService.notification.profileEdit.success).toEqual('Usuário editado com sucesso.');
      });
    });

    describe('roomDelete', function() {
      it('success', function() {
        expect(LabelService.notification.roomDelete.success).toEqual('Sala de discussão apagada com sucesso.');
      });
    });

    describe('topicDelete', function() {
      it('success', function() {
        expect(LabelService.notification.topicDelete.success).toEqual('Tópico apagado com sucesso.');
      });
    });

    describe('roomEntryRequest', function() {
      describe('invitation', function() {
        it('success', function() {
          expect(LabelService.notification.roomEntryRequest.invitation.success).toEqual('Pedido enviado com sucesso.');
        });
      });

      describe('accepted', function() {
        it('success', function() {
          expect(LabelService.notification.roomEntryRequest.accepted.success).toEqual('Pedido aceito com sucesso.');
        });
      });
    });
  });
});

describe('StartupService', function() {
  var StartupService, User;

  beforeEach(module('capivara'));

  beforeEach(inject(function(_StartupService_, _User_) {
    User = _User_
    StartupService = _StartupService_;
    StartupService.tasks = {
      userInit: function() {}
    }
  }));

  describe('#init', function() {
    beforeEach(function() {
      StartupService.startTasks = undefined;
    });

    it('defines startTasks', function() {
      expect(StartupService.startTasks).toBe(undefined);

      StartupService.init();

      expect(StartupService.startTasks).toEqual(['userInit']);
    });
  });

  describe('#executeTask', function() {
    beforeEach(function() {
      spyOn(StartupService.tasks, 'userInit');
    });

    it('executes task', function() {
      StartupService.executeTask('userInit');

      expect(StartupService.tasks.userInit).toHaveBeenCalled();
    });
  });
});