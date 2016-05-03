app.service('User', [
  '$q',
  '$http',
  'CacheService',

  function ($q,
            $http,
            CacheService) {
    var url,
        User,
        cache

    User = {
      init: function () {
        this.data = CacheService.get('user')
      },

      signIn: function (options) {
        var deferred = $q.defer(),
        url = Conf.baseUrl + 'users/sign_in',
        self = this

        $http.post(url, options)
          .success(function (response) {
            self.data = response.user
            self.token = response.api_key
            cache()
            deferred.resolve()
          })
          .error(function (response) {
            deferred.reject()
          })

        return deferred.promise
      },

      signOut: function () {
        var deferred = $q.defer(),
        url = Conf.baseUrl + 'users/sign_out'

        $http.delete(url, {
          headers: {
            'Authorization': 'Token token=' + User.token
          }
        })
        .success(function (response) {
          CacheService.set('user', null)
          this.data = null
          deferred.resolve()
        })
        .error(function (response) {
          deferred.reject(response.error)
        })

        return deferred.promise
      }
    }

    cache = function () {
      CacheService.set('user', User.data)
    }

    return User
  }
])