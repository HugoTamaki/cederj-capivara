var app = angular.module('capivara', [
  'ui.router',
  'templates',
  'LocalStorageModule'
])

app.config([
  '$stateProvider',
  '$urlRouterProvider',
  'localStorageServiceProvider',

  function ($stateProvider,
            $urlRouterProvider,
            localStorageServiceProvider) {

    localStorageServiceProvider
      .setPrefix('capivara')

    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'login.html',
        controller: 'LoginCtrl'
      })

      .state('sign_up', {
        url: '/sign_up',
        templateUrl: 'sign_up.html',
        controller: 'SignUpCtrl'
      })

      .state('about', {
        url: '/about',
        templateUrl: 'about.html'
      })

      .state('profile', {
        url: '/profile',
        templateUrl: 'profile.html',
        controller: 'ProfileCtrl'
      })
  }
])

.constant(
  'CONST', {
    'RESPONSE_STATUS': {
      'UNAUTHORIZED': 401,
      'OK': 200,
      'INTERNAL_SERVER_ERROR': 500,
      'SERVICE_UNAVAILABLE': 503,
      'UNPROCESSABLE_ENTITY': 422,
      'FORBIDDEN': 403
    }
  }
)