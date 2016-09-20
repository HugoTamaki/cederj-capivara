describe('UsersService', function() {
  var $rootScope, $httpBackend, UsersService

  beforeEach(module('capivara'))

  beforeEach(inject(function(_$rootScope_, _$httpBackend_, _UsersService_) {
    $rootScope = _$rootScope_
    UsersService = _UsersService_
    $httpBackend = _$httpBackend_
    $httpBackend.whenGET(/\.html$/).respond('')
  }));

  var usersURL = '@@backendURL/users/1'
  var visitedUser = 'Panana'

  describe('when getting visitedUser', function() {
    describe('with success', function() {
      beforeEach(function() {
        $httpBackend.expect("GET", usersURL).respond(200, visitedUser)
        $httpBackend.flush()
      })

      it('should get visitedUser', function() {
        var user = UsersService.getVisitedUser({id: 1})
        expect(user).toEqual('Pananan')
      })
    })
  })
});