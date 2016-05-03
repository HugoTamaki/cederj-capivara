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
      sign_in: function (options) {
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

      sign_out: function () {
        CacheService.set('user', null),
        this.data = null
      }
    }

    cache = function () {
      CacheService.set('user', User.data)
    }

    return User
  }
])