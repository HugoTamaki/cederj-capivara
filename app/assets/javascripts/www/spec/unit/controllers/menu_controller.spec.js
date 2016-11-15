'use strict';

describe('MenuCtrl', function() {
  var $controller, $state, $scope, $rootScope, $httpBackend, User, CacheService;

  var signOutURL = 'http://localhost:3000/api/v1/users/sign_out';

  beforeEach(module('capivara'));

  beforeEach(inject(function(_$controller_, _$state_, _$rootScope_, _$httpBackend_, _User_, _CacheService_) {
    $state = _$state_;
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    User = _User_;
    CacheService = _CacheService_;
    $httpBackend = _$httpBackend_;
    $httpBackend.whenGET(/\.html$/).respond('');
  }));

  function loadController() {
    $controller('MenuCtrl', { $scope: $scope });
  }

  beforeEach(function() {
    spyOn($state, 'go');
    spyOn(CacheService, 'remove');
    loadController();
  })

  describe('#signOut', function() {
    beforeEach(function() {
      $httpBackend.expect("DELETE", signOutURL).respond(200, {message: 'Session cleared'});
      $scope.signOut();
      $httpBackend.flush();
    });

    it('sends to login state', function() {
      expect($state.go).toHaveBeenCalledWith('login');
    });

    it('removes user from cache', function() {
      expect(CacheService.remove).toHaveBeenCalledWith('user');
    });
  });

  describe('#loginPage', function() {
    beforeEach(function() {
      $scope.loginPage();
    });

    it('sends to login page', function() {
      expect($state.go).toHaveBeenCalledWith('login');
    });
  });

  describe('#about', function() {
    beforeEach(function() {
      $scope.about();
    });

    it('sends to about page', function() {
      expect($state.go).toHaveBeenCalledWith('about');
    });
  });

  describe('#profile', function() {
    beforeEach(function() {
      $scope.profile();
    });

    it('sends to profile page', function() {
      expect($state.go).toHaveBeenCalledWith('profile');
    });
  });

  describe('#forum', function() {
    beforeEach(function() {
      $scope.forum();
    });

    it('sends to forum page', function() {
      expect($state.go).toHaveBeenCalledWith('forum');
    });
  });

  describe('#editProfile', function() {
    beforeEach(function() {
      $scope.editProfile();
    });

    it('sends to editProfile page', function() {
      expect($state.go).toHaveBeenCalledWith('edit_profile');
    });
  });
})