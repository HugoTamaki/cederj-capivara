app.service('ForumService', [
  '$q',
  '$http',

  function ($q,
            $http) {
    var ForumService = {
      getRooms: function (user) {
        var deferred = $q.defer(),
            url = Conf.baseUrl + '/rooms',
            self = this

        $http.get(url)
          .success(function (response) {
            deferred.resolve(response)
          })
          .error(function (response) {
            deferred.reject(response.error)
          })

        return deferred.promise
      },

      getRoomTopics: function (options) {
        var deferred = $q.defer(),
            url = Conf.baseUrl + '/rooms/' + options.room_id + '/topics'

        $http.get(url)
          .success(function (response) {
            deferred.resolve(response)
          })
          .error(function (response) {
            deferred.reject(response.error)
          })

        return deferred.promise
      },

      getRoom: function (options) {
        var deferred = $q.defer(),
            url = Conf.baseUrl + '/rooms/' + options.room_id

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

    return ForumService
  }
])