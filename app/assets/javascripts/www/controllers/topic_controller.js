app.controller('TopicCtrl', [
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


    TopicService.getTopic($stateParams)

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
