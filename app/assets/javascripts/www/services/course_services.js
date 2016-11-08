capivaraServices.service('CourseService', [
  '$q',
  '$http',

  function ($q,
            $http) {
    var CourseService = {
      getCourses: function () {
        var url = Conf.baseUrl + 'courses',
            deferred = $q.defer()

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

    return CourseService
  }
])