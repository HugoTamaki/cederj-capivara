app.controller('TopicCtrl', [
  '$scope',
  '$state',
  '$stateParams',
  'Topic',
  'TopicService',
  'MessageService',
  'LabelService',
  'usSpinnerService',

  function ($scope,
            $state,
            $stateParams,
            Topic,
            TopicService,
            MessageService,
            LabelService,
            usSpinnerService) {

    usSpinnerService.spin('topic')

    function getTopicAndMessages () {
      TopicService.getTopic($stateParams)
        .then(function (response) {
          $scope.topic = new Topic(response.topic)
          return MessageService.getMessages($stateParams)
        })
        .then(function (response) {
          $scope.topic.messages = response.messages
        })
        .catch(function (response) {
          $scope.error = LabelService.error.somethingWrong
        })
        .finally(function () {
          usSpinnerService.stop('topic')
        })
    }

    $scope.message = {}

    getTopicAndMessages()

    $scope.createMessage = function (topic, message) {
      var options = {
        room_id: topic.room_id,
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
  }
])


app.controller('NewTopicCtrl', [
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
