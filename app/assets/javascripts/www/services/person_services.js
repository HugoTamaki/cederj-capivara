app.service('PersonService', [
  '$q',
  '$http',

  function ($q,
            $http) {
    
    var PersonService = {
      getPerson: function (options) {
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

    return PersonService
  }
])