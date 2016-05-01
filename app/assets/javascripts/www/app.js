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

      .state('about', {
        url: '/about',
        templateUrl: 'about.html'
      })
  }
])
