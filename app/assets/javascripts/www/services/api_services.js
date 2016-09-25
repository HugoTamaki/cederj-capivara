capivaraServices.config([
  '$httpProvider',

  function ($httpProvider) {
    $httpProvider.interceptors.push('AccessTokenInterceptor')
    $httpProvider.interceptors.push('ForbiddenAccessInterceptor')
  }
])

.factory('AccessTokenInterceptor', [
  '$injector',

  function ($injector) {

    return {
      request: function (config) {
        var User = $injector.get('User')

        if (User.logged) {
          config.headers['Authorization'] = 'Token token=' + User.token
        }

        return config
      }
    }
  }
])

.factory('ForbiddenAccessInterceptor', [
  '$q',
  '$window',
  '$injector',
  'CONST',
  'CacheService',

  function ($q,
            $window,
            $injector,
            CONST,
            CacheService) {
    var isForbidden

    isForbidden = function (error) {
      return error.status === CONST.RESPONSE_STATUS.UNAUTHORIZED
    }

    return {
      responseError: function (error) {
        var User = $injector.get('User')

        if (isForbidden(error)) {
          _(User).extend({})
          User.logged = false
          CacheService.set('user', null)
          console.log('>>> (Interceptor) Forbidden.')
          $window.location.hash = '#/login'
        }

        return $q.reject(error)
      }
    }
  }
])