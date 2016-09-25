capivaraServices.service('CoursesService', [
  '$q',
  '$http',

  function ($q,
            $http) {
    var CoursesService = {
      getCourses: function () {
        var url = Conf.baseUrl + 'courses/',
            deferred = $q.defer()

        $http.get(url)
          .success(function (response) {
            deferred.resolve(response)
          })
          .error(function (response) {
            deferred.reject(response.errors)
          })

        return deferred.promise
      }
    }

    return CoursesService
  }
])