var capivaraServices  = angular.module('capivara.services', []);
var capivaraFactories  = angular.module('capivara.factories', []);
var capivaraDirectives  = angular.module('capivara.directives', []);

var capivara = angular.module('capivara', [
  'ui.router',
  'templates',
  'angularSpinner',
  'LocalStorageModule',
  'capivara.services',
  'capivara.factories',
  'capivara.directives'
])

capivara.config([
  '$stateProvider',
  '$locationProvider',
  '$urlRouterProvider',
  'usSpinnerConfigProvider',
  'localStorageServiceProvider',

  function ($stateProvider,
            $locationProvider,
            $urlRouterProvider,
            usSpinnerConfigProvider,
            localStorageServiceProvider) {

    localStorageServiceProvider
      .setPrefix('capivara')

    $locationProvider.html5Mode(true)

    $urlRouterProvider.otherwise('/profile')

    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'user/login.html',
        controller: 'LoginCtrl',
        data: {
          requireLogin: false
        }
      })

      .state('sign_up', {
        url: '/sign_up',
        templateUrl: 'user/sign_up.html',
        controller: 'SignUpCtrl',
        data: {
          requireLogin: false
        }
      })

      .state('about', {
        url: '/about',
        templateUrl: 'general/about.html',
        data: {
          requireLogin: false
        }
      })

      .state('profile', {
        url: '/profile',
        templateUrl: 'user/profile.html',
        controller: 'ProfileCtrl',
        data: {
          requireLogin: true
        }
      })

      .state('users', {
        url: '/users/:id',
        templateUrl: 'users/user.html',
        controller: 'VisitedUserCtrl',
        data: {
          requireLogin: true
        }
      })

      .state('forum', {
        url: '/forum',
        templateUrl: 'forum/forum.html',
        controller: 'ForumCtrl',
        data: {
          requireLogin: true
        }
      })

      .state('room', {
        url: '/room/:room_id/topics',
        templateUrl: 'forum/room.html',
        controller: 'RoomCtrl',
        data: {
          requireLogin: true
        }
      })

      .state('new_room', {
        url: '/room/new_room',
        templateUrl: 'forum/new_room.html',
        controller: 'NewRoomCtrl',
        data: {
          requireLogin: true
        }
      })

      .state('new_topic', {
        url: '/room/:room_id/new_topic',
        templateUrl: 'forum/new_topic.html',
        controller: 'NewTopicCtrl',
        data: {
          requireLogin: true
        }
      })

      .state('topic', {
        url: '/room/:room_id/topic/:topic_id/messages',
        templateUrl: 'forum/topic.html',
        controller: 'TopicCtrl',
        data: {
          requireLogin: true
        }
      })

      .state('edit_profile', {
        url: '/edit_profile',
        templateUrl: 'user/edit_profile.html',
        controller: 'ProfileEditCtrl',
        data: {
          requireLogin: true
        }
      })

    usSpinnerConfigProvider.setTheme('small', { color: 'black', radius: 6, top: '50%', left: '50%' })
  }
])

capivara.constant(
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

capivara.run([
  'User',

  '$state',
  '$location',
  '$rootScope',
  'StartupService',

  function (User,

            $state,
            $location,
            $rootScope,
            StartupService) {

    var appStarted = 0; // flag to redirect only once when app is started
    $rootScope.$on('$stateChangeStart',
    function(event) {
      if(appStarted) return;
      appStarted = 1;
      event.preventDefault()
      moment.locale('pt-BR')

      StartupService.init()

      _(StartupService.startTasks).each(function (task) {
        StartupService.executeTask(task)
      })
    })

    if (!User.logged) {
      $state.go('login')
    }

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
      var requireLogin = toState.data.requireLogin

      if (requireLogin && !User.logged) {
        $location.path('login')
      }
    })
  }
])
