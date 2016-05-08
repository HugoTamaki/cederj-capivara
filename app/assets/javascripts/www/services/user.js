app.service('User', [
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
        this.data = CacheService.get('user')
        if (this.data) {
          this.logged = true
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

        $http.delete(url, {
          headers: {
            'Authorization': 'Token token=' + User.data.token
          }
        })
        .success(function (response) {
          CacheService.set('user', null)
          self.data = null
          self.logged = false
          deferred.resolve()
        })
        .error(function (response) {
          deferred.reject(response.error)
        })

        return deferred.promise
      }
    }

    extendAndCache = function (response) {
      User.data = _(response.user).extend({ token: response.api_key })
      User.logged = true
      cache()
    }

    cache = function () {
      CacheService.set('user', User.data)
    }

    return User
  }
])