var app = angular.module('capivara', [
  'ui.router',
  'templates',
  'angularSpinner',
  'LocalStorageModule'
])

app.config([
  '$stateProvider',
  '$urlRouterProvider',
  'usSpinnerConfigProvider',
  'localStorageServiceProvider',

  function ($stateProvider,
            $urlRouterProvider,
            usSpinnerConfigProvider,
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

      .state('edit_profile', {
        url: '/edit_profile',
        templateUrl: 'edit_profile.html',
        controller: 'ProfileEditCtrl'
      })

    usSpinnerConfigProvider.setTheme('small', { color: 'black', radius: 6, top: '50%', left: '50%' })
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