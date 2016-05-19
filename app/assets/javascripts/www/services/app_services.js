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

.service('LabelService', [

  function () {
    var LabelService = {
      error: {
        failedLogin: 'Email ou senha errados.',
        somethingWrong: 'Alguma coisa aconteceu, tente novamente mais tarde.',
        alreadyTaken: 'Já existe um usuário com este email.'
      }
    }

    return LabelService
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

          if (!User.logged) {
            $state.go('login')
          } else if (window.location.hash === '') {
            $state.go('profile')
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
