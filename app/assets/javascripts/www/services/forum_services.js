app.service('RoomService', [
  '$q',
  '$http',

  function ($q,
            $http) {
    var RoomService = {
      term: '',

      getRooms: function () {
        var deferred = $q.defer(),
            url = Conf.baseUrl + 'rooms'

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
            url = Conf.baseUrl + 'rooms/participating_rooms'

        $http.get(url)
          .success(function (response) {
            deferred.resolve(response)
          })
          .error(function (response) {
            deferred.reject(response.error)
          })

        return deferred.promise
      },

      getSearch: function () {
        var deferred = $q.defer(),
            url = Conf.baseUrl + 'rooms/search'

        var options = {
          params: {
            term: this.term
          }
        }

        $http.get(url, options)
          .success(function (response) {
            deferred.resolve(response)
          })
          .error(function (response) {
            deferred.resolve(response.error)
          })

        return deferred.promise
      },

      getRoomTopics: function (options) {
        var deferred = $q.defer(),
            url = Conf.baseUrl + 'rooms/' + options.room_id + '/topics'

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
            url = Conf.baseUrl + 'rooms/' + options.room_id

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
            url = Conf.baseUrl + 'rooms'

        $http.post(url, options)
          .success(function (response) {
            deferred.resolve(response)
          })
          .error(function (response) {
            deferred.reject(response.error)
          })

        return deferred.promise
      },

      deleteRoom: function (options) {
        var deferred = $q.defer(),
            url = Conf.baseUrl + 'rooms/' + options.id

        $http.delete(url)
          .success(function (response) {
            deferred.resolve(response)
          })
          .error(function (response) {
            deferred.reject(response.error)
          })

        return deferred.promise
      },

      createRoomEntryRequest: function (options) {
        var deferred = $q.defer(),
            url = Conf.baseUrl + 'room_entry_requests'

        $http.post(url, options)
          .success(function (response) {
            deferred.resolve(response.room_entry_request)
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
      },

      deleteTopic: function (options) {
        var deferred = $q.defer(),
            url = Conf.baseUrl + 'rooms/' + options.room.id + '/topics/' + options.id

        $http.delete(url)
          .success(function (response) {
            deferred.resolve(response)
          })
          .error(function (reject) {
            deferred.reject(response.error)
          })

        return deferred.promise
      }
    }

    return TopicService
  }
])

.service('MessageService', [
  '$q',
  '$http',

  function ($q,
            $http) {
    var MessageService = {
      getMessages: function (options) {
        var deferred = $q.defer(),
            url = Conf.baseUrl + 'rooms/' + options.room_id + '/topics/' + options.topic_id + '/messages'

        $http.get(url)
          .success(function (response) {
            deferred.resolve(response)
          })
          .error(function (response) {
            deferred.reject(response.error)
          })

        return deferred.promise
      },

      createMessage: function (options) {
        var deferred = $q.defer(),
            url = Conf.baseUrl + 'rooms/' + options.room.id + '/topics/' + options.topic_id + '/messages',
            params

        params = options.message

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

    return MessageService
  }
])

.service('RoomEntryRequestService', [
  '$q',
  '$http',

  function ($q,
            $http) {

    var RoomEntryRequestService = {
      getRoomEntryRequests: function () {

      },

      getSentRoomEntryRequests: function (options) {
        var deferred = $q.defer(),
            url = Conf.baseUrl + 'room_entry_requests/sent_requests/',
            data

        data = {
          params: {
            room_id: options.room_id
          }
        }

        $http.get(url, data)
          .success(function (response) {
            deferred.resolve(response)
          })
          .error(function (response) {
            deferred.reject(response.error)
          })

        return deferred.promise
      }
    }

    return RoomEntryRequestService
  }
])