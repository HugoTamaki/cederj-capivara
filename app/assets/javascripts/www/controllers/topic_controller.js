capivara.controller('TopicCtrl', [
  '$scope',
  '$state',
  '$stateParams',
  'Topic',
  'Message',
  'TopicService',
  'MessageService',
  'LabelService',
  'usSpinnerService',

  function ($scope,
            $state,
            $stateParams,
            Topic,
            Message,
            TopicService,
            MessageService,
            LabelService,
            usSpinnerService) {

    usSpinnerService.spin('my-messages')

    function getTopicAndMessages () {
      TopicService.getTopic($stateParams)
        .then(function (response) {
          $scope.topic = new Topic(response.topic)
          return MessageService.getMessages($stateParams)
        })
        .then(function (response) {
          $scope.topic.messages = _(response.messages).map(function (message) {
            return new Message(message)
          })
        })
        .catch(function (response) {
          $scope.error = LabelService.error.somethingWrong
        })
        .finally(function () {
          usSpinnerService.stop('my-messages')
        })
    }

    $scope.message = {}

    getTopicAndMessages()

    $scope.createMessage = function (topic, message) {
      var options = {
        room: topic.room,
        topic_id: topic.id,
        message: message
      }

      MessageService.createMessage(options)
        .then(function () {
          getTopicAndMessages()
          $scope.message = {}
        })
        .catch(function (response) {
          console.log(response)
        })
    }

    $scope.goToVisitedUser = function (user) {
      $state.go('users', { id: user.id })
    }
  }
])


capivara.controller('NewTopicCtrl', [
  '$scope',
  '$state',
  '$stateParams',
  'TopicService',
  'LabelService',
  'usSpinnerService',

  function ($scope,
            $state,
            $stateParams,
            TopicService,
            LabelService,
            usSpinnerService) {

    $scope.topic = {}

    $scope.topic.room_id = $stateParams.room_id

    $scope.createTopic = function (topic) {

      usSpinnerService.spin('create-topic')

      TopicService.createTopic(topic)
        .then(function (response) {
          $state.go('topic', { room_id: $stateParams.room_id, topic_id: response.topic.id })
        })
        .catch(function (response) {
          $scope.error = LabelService.error.somethingWrong
        })
        .finally(function () {
          usSpinnerService.stop('topic-room')
        })
    }
  }
])
