app.service('RoomService', [
  '$q',
  '$http',

  function ($q,
            $http) {
    var RoomService = {
      getRooms: function () {
        var deferred = $q.defer(),
            url = Conf.baseUrl + '/rooms'

        $http.get(url)
          .success(function (response) {
            deferred.resolve(response)
          })
          .error(function (response) {
            deferred.reject(response.error)
          })

        return deferred.promise
      },

      getParticipatingRooms: function () {
        var deferred = $q.defer(),
            url = Conf.baseUrl + '/rooms/participating_rooms'

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
      },

      createRoom: function (options) {
        var deferred = $q.defer(),
            url = Conf.baseUrl + '/rooms'

        $http.post(url, options)
          .success(function (response) {
            deferred.resolve(response)
          })
          .error(function (response) {
            deferred.reject(response.error)
          })

        return deferred.promise
      }
    }

    return RoomService
  }
])

.service('TopicService', [
  '$q',
  '$http',

  function ($q,
            $http) {

    var TopicService = {
      getTopic: function (options) {
        var deferred = $q.defer(),
            url = Conf.baseUrl + 'rooms/' + options.room_id + '/topics/' + options.topic_id

        $http.get(url)
          .success(function (response) {
            deferred.resolve(response)
          })
          .error(function (response) {
            deferred.reject(response.error)
          })

        return deferred.promise
      },

      createTopic: function (options) {
        var deferred = $q.defer(),
            url = Conf.baseUrl + 'rooms/' + options.room_id + '/topics',
            params

        params = {
          name: options.name,
          content: options.content
        }

        $http.post(url, params)
          .success(function (response) {
            deferred.resolve(response)
          })
          .error(function (response) {
            deferred.reject(response.error)
          })

        return deferred.promise
      }
    }

    return TopicService
  }
])