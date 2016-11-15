capivaraServices.service('User', [
  '$q',
  '$http',
  'CacheService',

  function ($q,
            $http,
            CacheService) {
    var url,
        User,
        cache,
        extendAndCache

    User = {
      init: function () {
        var self = this,
            data
        data = CacheService.get('user')
        _(User).extend(data)
        if (User.token) {
          self.logged = true
        }
      },

      signUp: function (options) {
        var deferred = $q.defer(),
            url = Conf.baseUrl + 'users/',
            self = this,
            error

        $http.post(url, options)
          .success(function (response) {
            extendAndCache(response)
            deferred.resolve()
          })
          .error(function (response) {
            deferred.reject(response.error)
          })

        return deferred.promise
      },

      signIn: function (options) {
        var deferred = $q.defer(),
            url = Conf.baseUrl + 'users/sign_in',
            self = this

        $http.post(url, options)
          .success(function (response) {
            extendAndCache(response)
            deferred.resolve()
          })
          .error(function (response) {
            deferred.reject()
          })

        return deferred.promise
      },

      signOut: function () {
        var deferred = $q.defer(),
            url = Conf.baseUrl + 'users/sign_out',
            self = this

        $http.delete(url)
          .success(function (response) {
            CacheService.remove('user')
            self.logged = false
            deferred.resolve()
          })
          .error(function (response) {
            deferred.reject(response.error)
          })

        return deferred.promise
      },

      edit: function (options) {
        var deferred = $q.defer(),
            url = Conf.baseUrl + 'users',
            self = this

        $http.put(url, options)
          .success(function (response) {
            extendAndCache(response)
            deferred.resolve()
          })
          .error(function (response) {
            deferred.reject()
          })

        return deferred.promise
      },

      updateRoomIds: function (room) {
        this.room_ids = room.user.room_ids
        cache()
      }
    }

    extendAndCache = function (response) {
      _(User).extend(response.user, {token: response.api_key})
      User.logged = true
      cache()
    }

    cache = function () {
      CacheService.set('user', User)
    }

    return User
  }
])