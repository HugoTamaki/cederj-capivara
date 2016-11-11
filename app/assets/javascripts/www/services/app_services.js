capivaraServices.service('CacheService', [
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
      },
      notification: {
        profileEdit: {
          success: 'Usuário editado com sucesso.'
        },
        roomDelete: {
          success: 'Sala de discussão apagada com sucesso.'
        },
        topicDelete: {
          success: 'Tópico apagado com sucesso.'
        },
        roomEntryRequest: {
          invitation: {
            success: 'Pedido enviado com sucesso.'
          },
          accepted: {
            success: 'Pedido aceito com sucesso.'
          }
        }
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
        }
      }
    }

    return StartupService
  }
])
