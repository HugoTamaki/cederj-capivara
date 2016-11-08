var Conf = {
  baseUrl: 'http://localhost:3000/api/v1/'
}
describe('User', function() {
  var $q, $rootScope, $httpBackend, User, deferred, CacheService, userData

  beforeEach(module('capivara'))

  beforeEach(inject(function(_$q_, _$rootScope_, _$httpBackend_, _User_, _CacheService_) {
    $q = _$q_
    $rootScope = _$rootScope_
    User = _User_
    $httpBackend = _$httpBackend_
    CacheService = _CacheService_
    $httpBackend.whenGET(/\.html$/).respond('')
    deferred = _$q_.defer()
    userData = {
      id: 1,
      first_name: 'Fulano',
      last_name: 'da Silva',
      email: 'fulano@email.com',
      token: "142059f0705343f68e38dd3f8b3e00b6:4196a045547d4089a77bd7919fce6033",
      room_ids: []
    }
  }))

  var usersURL = 'http://localhost:3000/api/v1/users/'
  var signOutURL = 'http://localhost:3000/api/v1/users/sign_out'

  describe('#init', function() {
    beforeEach(function() {
      spyOn(CacheService, 'get').and.returnValue(userData)
    })

    it('sets data to service', function() {
      expect(User.first_name).toEqual(undefined)
      expect(User.last_name).toEqual(undefined)
      expect(User.email).toEqual(undefined)
      expect(User.token).toEqual(undefined)
      expect(User.room_ids).toEqual(undefined)
      User.init()
      expect(User.first_name).toEqual('Fulano')
      expect(User.last_name).toEqual('da Silva')
      expect(User.email).toEqual('fulano@email.com')
      expect(User.token).toEqual("142059f0705343f68e38dd3f8b3e00b6:4196a045547d4089a77bd7919fce6033")
      expect(User.room_ids).toEqual([])
    })

    it('does not set User as logged if there is no token', function() {
      userData.token = null
      expect(User.logged).toEqual(undefined)
      User.init()
      expect(User.logged).toEqual(undefined)
    })

    it('sets User as logged if there is token', function() {
      expect(User.logged).toEqual(undefined)
      User.init()
      expect(User.logged).toEqual(true)
    })
  })

  describe('#signUp', function() {
    var options

    beforeEach(function() {
      options = {}
    })

    describe('success', function() {
      it('calls users post', function() {
        $httpBackend.expect('POST', usersURL).respond(200, {
          user: {
            id: 1,
            first_name: 'Fulano',
            last_name: 'da Silva',
            email: 'fulano@email.com',
            room_ids: []
          },
          api_key: "0b6d7646caa040be8ac65b8969ba9e08:8356ec5c67b5436d8df57324b8e70cfd"
        })

        User.signUp(options)
        $httpBackend.flush()
      })

      it('sets user data to User', function() {
        $httpBackend.expect('POST', usersURL).respond(200, {
          user: {
            id: 1,
            first_name: 'Fulano',
            last_name: 'da Silva',
            email: 'fulano@email.com',
            room_ids: []
          },
          api_key: "0b6d7646caa040be8ac65b8969ba9e08:8356ec5c67b5436d8df57324b8e70cfd"
        })

        expect(User.first_name).toEqual(undefined)
        expect(User.last_name).toEqual(undefined)
        expect(User.email).toEqual(undefined)
        expect(User.token).toEqual(undefined)
        expect(User.room_ids).toEqual(undefined)
        User.signUp(options)
        $httpBackend.flush()
        expect(User.first_name).toEqual('Fulano')
        expect(User.last_name).toEqual('da Silva')
        expect(User.email).toEqual('fulano@email.com')
        expect(User.token).toEqual("0b6d7646caa040be8ac65b8969ba9e08:8356ec5c67b5436d8df57324b8e70cfd")
        expect(User.room_ids).toEqual([])
      })

      it('sets User as logged', function() {
        $httpBackend.expect('POST', usersURL).respond(200, {
          user: {
            id: 1,
            first_name: 'Fulano',
            last_name: 'da Silva',
            email: 'fulano@email.com',
            room_ids: []
          },
          api_key: "0b6d7646caa040be8ac65b8969ba9e08:8356ec5c67b5436d8df57324b8e70cfd"
        })

        expect(User.logged).toEqual(undefined)
        User.signUp(options)
        $httpBackend.flush()
        expect(User.logged).toEqual(true)
      })

      it('calls CacheService set', function() {
        $httpBackend.expect('POST', usersURL).respond(200, {
          user: {
            id: 1,
            first_name: 'Fulano',
            last_name: 'da Silva',
            email: 'fulano@email.com',
            room_ids: []
          },
          api_key: "0b6d7646caa040be8ac65b8969ba9e08:8356ec5c67b5436d8df57324b8e70cfd"
        })

        spyOn(CacheService, 'set')
        User.signUp(options)
        $httpBackend.flush()
        expect(CacheService.set).toHaveBeenCalled()
      })
    })

    describe('failure', function() {
      it('does not set User as logged', function() {
        $httpBackend.expect('POST', usersURL).respond(400, {})

        expect(User.logged).toEqual(undefined)
        User.signUp(options)
        $httpBackend.flush()
        expect(User.logged).toEqual(undefined)
      })
    })
  })

  describe('#signOut', function() {
    beforeEach(function() {
      User.logged = true
    })

    describe('success', function() {
      it('calls delete on user', function() {
        $httpBackend.expect('DELETE', signOutURL).respond(200, {})
        User.signOut()
        $httpBackend.flush()
      })

      it('sets user on cache with null', function() {
        spyOn(CacheService, 'set')
        $httpBackend.expect('DELETE', signOutURL).respond(200, {})
        User.signOut()
        $httpBackend.flush()
        expect(CacheService.set).toHaveBeenCalledWith('user', null)
      })

      it('sets User as not logged', function() {
        $httpBackend.expect('DELETE', signOutURL).respond(200, {})
        User.signOut()
        $httpBackend.flush()
        expect(User.logged).toEqual(false)
      })
    })

    describe('failure', function() {
      it('does not sets user on cache with null', function() {
        spyOn(CacheService, 'set')
        $httpBackend.expect('DELETE', signOutURL).respond(400, {})
        User.signOut()
        $httpBackend.flush()
        expect(CacheService.set).not.toHaveBeenCalledWith('user', null)
      })

      it('does not sets User as not logged', function() {
        $httpBackend.expect('DELETE', signOutURL).respond(400, {})
        User.signOut()
        $httpBackend.flush()
        expect(User.logged).toEqual(true)
      })
    })
  })
});