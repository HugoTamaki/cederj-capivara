app.controller('AppCtrl', [
  '$scope',
  '$state',
  'StartupService',

  function ($scope,
            $state,
            StartupService) {


    StartupService.init()

    _(StartupService.startTasks).each(function (task) {
      StartupService.executeTask(task)
    })
  }
])