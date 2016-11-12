'use strict';

describe('LoginCtrl', function() {
  var $controller, $state, $scope, $rootScope, $httpBackend, User, usSpinnerService, LabelService;

  var signInURL = 'http://localhost:3000/api/v1/users/sign_in';

  var userResponse = {
    id: 1,
    first_name: 'John',
    last_name: 'Doe',
    email: 'johndoe@email.com',
    room_ids: []
  }

  beforeEach(module('capivara'));

  beforeEach(inject(function(_$controller_, _$state_, _$rootScope_, _$httpBackend_, _User_, _usSpinnerService_, _LabelService_) {
    $state = _$state_;
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    User = _User_;
    usSpinnerService = _usSpinnerService_;
    LabelService = _LabelService_;
    $httpBackend = _$httpBackend_;
    $httpBackend.whenGET(/\.html$/).respond('');
  }));

  function loadController() {
    $controller('LoginCtrl', { $scope: $scope });
  }

  describe('when initializing', function() {
    beforeEach(function() {
      loadController();
    });

    it('defines user at $scope', function() {
      expect($scope.user).toEqual({});
    });
  });

  describe('#login', function() {
    var user = {
      email: 'johndoe@email.com',
      password: '123456'
    };

    beforeEach(function() {
      spyOn(usSpinnerService, 'spin');
      spyOn($state, 'go');
      loadController();
      $httpBackend.expect("POST", signInURL).respond(200, {user: userResponse, api_key: 'TOKEN'});
      $scope.login(user);
      $httpBackend.flush();
    });

    describe('success', function() {
      it('spins loader', function() {
        expect(usSpinnerService.spin).toHaveBeenCalled();
      });

      it('sends to profile page', function() {
        expect($state.go).toHaveBeenCalledWith('profile');
      });
    });
  });

  describe('#goToSignUp', function() {
    beforeEach(function() {
      spyOn($state, 'go');
      loadController();
      $scope.goToSignUp();
    });

    it('sends to signUp state', function() {
      expect($state.go).toHaveBeenCalledWith('sign_up');
    });
  });
});