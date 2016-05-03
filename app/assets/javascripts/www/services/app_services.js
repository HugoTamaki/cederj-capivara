app.service('CacheService', [
  '$window',
  'localStorageService',

  function ($window,
            localStorageService) {

    var CacheService = {
      get: function (key) {
        return localStorageService.get(key)
      },

      set: function (key, value) {
        localStorageService.set(key, value)
      },

      remove: function (key) {
        localStorageService.remove(key)
      }
    }

    return CacheService
  }
])

.service('StartupService', [
  '$state',
  'User',
  'CacheService',

  function ($state,
            User,
            CacheService) {
    var user,
        StartupService

    StartupService = {
      init: function () {
        this.startTasks = Object.getOwnPropertyNames(this.tasks)
      },

      executeTask: function (task) {
        this.tasks[task]()
      },

      tasks: {
        userInit: function () {
          User.init()

          if (!_.isEmpty(User.data)) {
            $state.go('profile');
          } else {
            $state.go('login');
          }
        }
      }
    }

    return StartupService
  }
])

.run([
  '$rootScope',
  'StartupService',

  function ($rootScope,
            StartupService) {

    var appStarted = 0; // flag to redirect only once when app is started
    $rootScope.$on('$stateChangeStart',
    function(event) {
      if(appStarted) return;
      appStarted = 1;
      event.preventDefault()
      StartupService.init()

      _(StartupService.startTasks).each(function (task) {
        StartupService.executeTask(task)
      })
    });
  }
])