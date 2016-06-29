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
        controller: 'LoginCtrl',
        data: {
          requireLogin: false
        }
      })

      .state('sign_up', {
        url: '/sign_up',
        templateUrl: 'sign_up.html',
        controller: 'SignUpCtrl',
        data: {
          requireLogin: false
        }
      })

      .state('about', {
        url: '/about',
        templateUrl: 'about.html',
        data: {
          requireLogin: false
        }
      })

      .state('profile', {
        url: '/profile',
        templateUrl: 'profile.html',
        controller: 'ProfileCtrl',
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
        url: 'room/:room_id/topics',
        templateUrl: 'forum/room.html',
        controller: 'RoomCtrl',
        data: {
          requireLogin: true
        }
      })

      .state('new_room', {
        url: 'room/new_room',
        templateUrl: 'forum/new_room.html',
        controller: 'NewRoomCtrl',
        data: {
          requireLogin: true
        }
      })

      .state('new_topic', {
        url: 'room/:room_id/new_topic',
        templateUrl: 'forum/new_topic.html',
        controller: 'NewTopicCtrl',
        data: {
          requireLogin: true
        }
      })

      .state('topic', {
        url: 'room/:room_id/topic/:topic_id/messages',
        templateUrl: 'forum/topic.html',
        controller: 'TopicCtrl',
        data: {
          requireLogin: true
        }
      })

      .state('edit_profile', {
        url: '/edit_profile',
        templateUrl: 'edit_profile.html',
        controller: 'ProfileEditCtrl',
        data: {
          requireLogin: true
        }
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