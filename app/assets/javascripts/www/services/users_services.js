app.service('UsersService', [
  '$q',
  '$http',

  function ($q,
            $http) {
    
    var UsersService = {
      getVisitedUser: function (options) {
        var deferred = $q.defer(),
            url = Conf.baseUrl + 'users/' + options.id

        $http.get(url)
          .success(function (response) {
            deferred.resolve(response)
          })
          .error(function (response) {
            deferred.reject(response.error)
          })

        return deferred.promise
      }
    }

    return UsersService
  }
])