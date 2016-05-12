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
          }
        }
      }
    }

    return StartupService
  }
])
