'use strict';

describe('Profile', function() {
  describe('ProfileCtrl', function() {
    var $controller, $state, $scope, $rootScope, $httpBackend;

    beforeEach(module('capivara'));

    beforeEach(inject(function(_$controller_, _$state_, _$rootScope_, _$httpBackend_) {
      $state = _$state_;
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      $scope = $rootScope.$new();
      $httpBackend = _$httpBackend_;
      $httpBackend.whenGET(/\.html$/).respond('');
    }));

    function loadController() {
      $controller('ProfileCtrl', { $scope: $scope });
    }

    beforeEach(function() {
      loadController();
    });

    describe('when initializing', function() {
      it('defines $scope.user', function() {
        expect($scope.user).toBeDefined();
      });
    });

    describe('setStatus', function() {
      it('returns a fazer when incomplete', function() {
        expect($scope.setStatus('incomplete')).toBe('a fazer');
      });

      it('returns a fazendo when doing', function() {
        expect($scope.setStatus('doing')).toBe('fazendo');
      });

      it('returns a completo when complete', function() {
        expect($scope.setStatus('complete')).toBe('completo');
      });
    })
  });

  describe('ProfileEditCtrl', function() {
    var $controller, $state, $scope, $rootScope, $httpBackend, User, LabelService, usSpinnerService;

    var editURL = 'http://localhost:3000/api/v1/users';

    var user = {
      first_name: 'John',
      last_name: 'Doe',
      disciplines: []
    }

    beforeEach(module('capivara'));

    beforeEach(inject(function(_$controller_, _$state_, _$rootScope_, _$httpBackend_, _User_, _LabelService_, _usSpinnerService_) {
      $state = _$state_;
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      $scope = $rootScope.$new();
      LabelService = _LabelService_;
      User = _User_;
      usSpinnerService = _usSpinnerService_;
      $httpBackend = _$httpBackend_;
      $httpBackend.whenGET(/\.html$/).respond('');
    }));

    function loadController() {
      $controller('ProfileEditCtrl', { $scope: $scope });
    }

    beforeEach(function() {
      loadController();
      spyOn(usSpinnerService, 'spin');
      spyOn(usSpinnerService, 'stop');
    })

    describe('when initializing', function() {
      beforeEach(function() {
        User.disciplines = [];
      })

      it('defines user', function() {
        expect($scope.user).toBeDefined();
      });

      it('defines disciplines', function() {
        expect($scope.disciplines).toBeDefined();
      });
    });

    describe('#edit', function() {
      describe('success', function() {
        beforeEach(function() {
          $httpBackend.expect("PUT", editURL).respond(200, {});
          $scope.edit(user);
          $httpBackend.flush();
        });

        it('spins edit_profile spinner', function() {
          expect(usSpinnerService.spin).toHaveBeenCalledWith('edit_profile');
        });

        it('sets $scope.error as null', function() {
          expect($scope.error).toBe(null);
        });

        it('sets $scope.notice', function() {
          expect($scope.notice).toBe('Usuário editado com sucesso.');
        });

        it('deletes $scope.user.current_password', function() {
          expect($scope.user.current_password).not.toBeDefined();
        });

        it('deletes $scope.user.password', function() {
          expect($scope.user.password).not.toBeDefined();
        });

        it('deletes $scope.user.password_confirmation', function() {
          expect($scope.user.password_confirmation).not.toBeDefined();
        });

        it('stops edit_profile spinner', function() {
          expect(usSpinnerService.stop).toHaveBeenCalledWith('edit_profile');
        });
      });

      describe('failure', function() {
        beforeEach(function() {
          $httpBackend.expect("PUT", editURL).respond(400, {});
          $scope.edit(user);
          $httpBackend.flush();
        });

        it('sets $scope.notice as null', function() {
          expect($scope.notice).toBe(null);
        });

        it('sets $scope.error', function() {
          expect($scope.error).toEqual('Alguma coisa aconteceu, tente novamente mais tarde.');
        });
      });
    });
  });
});