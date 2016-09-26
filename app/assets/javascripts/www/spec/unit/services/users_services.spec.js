var Conf = {
  baseUrl: 'http://localhost:3000/api/v1/'
}
describe('UsersService', function() {
  var $q, $rootScope, $httpBackend, UsersService, deferred

  beforeEach(module('capivara'))

  beforeEach(inject(function(_$q_, _$rootScope_, _$httpBackend_, _UsersService_) {
    $q = _$q_
    $rootScope = _$rootScope_
    UsersService = _UsersService_
    $httpBackend = _$httpBackend_
    $httpBackend.whenGET(/\.html$/).respond('')
    deferred = _$q_.defer();
  }));

  var usersURL = 'http://localhost:3000/api/v1/users/1'
  var visitedUser = {
    id: 1,
    first_name: 'Lerinho',
    last_name: 'Loroteiro',
    email: 'lerinho@gmail.com',
    course: {
      id: 1,
      name: 'Tecnologia em Sistemas de Computacao'
    },
    current_disciplines: [],
    common_disciplines: []
  }

  describe('when getting visitedUser', function() {
    describe('with success', function() {
      beforeEach(function() {
        $httpBackend.whenGET(usersURL).respond(200, visitedUser)
      })

      it('should get visitedUser', function() {
        deferred.resolve(visitedUser)
        var user

        UsersService.getVisitedUser({id: 1})
          .then(function(response) {
            user = response
          })

        $httpBackend.flush()
        expect(user).toEqual(visitedUser)
      })
    })
  })
});