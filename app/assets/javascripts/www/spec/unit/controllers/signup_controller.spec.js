'use strict';

describe('Signup', function() {
  describe('SignUpCtrl', function() {
    var $controller, $state, $stateParams, $scope, $rootScope, $httpBackend, usSpinnerService, LabelService, CourseService, courses;

    var coursesURL = 'http://localhost:3000/api/v1/courses';
    var signUpURL = 'http://localhost:3000/api/v1/users';

    beforeEach(module('capivara'));

    courses = {
      courses: [
        {
          id: 1,
          name: 'Tecnologia em Sistemas de Computação'
        },
        {
          id: 2,
          name: 'Pedagogia'
        }
      ]
    }

    beforeEach(inject(function(_$controller_, _$state_, _$stateParams_, _$rootScope_, _$httpBackend_, _usSpinnerService_, _LabelService_, _CourseService_) {
      $state = _$state_;
      $stateParams = _$stateParams_;
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      $scope = $rootScope.$new();
      $httpBackend = _$httpBackend_;
      usSpinnerService = _usSpinnerService_;
      LabelService = _LabelService_;
      CourseService = _CourseService_;
      $httpBackend.whenGET(/\.html$/).respond('');
    }));

    function loadController() {
      $controller('SignUpCtrl', { $scope: $scope, $stateParams: {room_id: 1} });
    }

    describe('when initializing', function() {
      beforeEach(function() {
        $httpBackend.expect("GET", coursesURL).respond(200, courses);
        loadController();
        $httpBackend.flush();
      });

      it('loads courses', function() {
        expect($scope.courses).toEqual(courses.courses);
      });
    });

    describe('#signUp', function() {
      describe('success', function() {
        beforeEach(function() {
          var user = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'johndoe@email.com',
            course_id: 1,
            password: '123123123',
            passwordConfirmation: '123123123'
          };

          spyOn(usSpinnerService, 'spin');
          spyOn($state, 'go');

          $httpBackend.expect("GET", coursesURL).respond(200, courses);
          loadController();
          $httpBackend.flush();
          $httpBackend.expect("POST", signUpURL).respond(200, {});
          $scope.signUp(user);
          $httpBackend.flush();
        });

        it('spins loader', function() {
          expect(usSpinnerService.spin).toHaveBeenCalledWith('sign_up');
        });

        it('sends to profile page', function() {
          expect($state.go).toHaveBeenCalledWith('profile');
        });
      });

      describe('failure', function() {
        describe('already been taken', function() {
          beforeEach(function() {
            var user = {
              firstName: 'John',
              lastName: 'Doe',
              email: 'johndoe@email.com',
              course_id: 1,
              password: '123123123',
              passwordConfirmation: '123123123'
            };

            spyOn(usSpinnerService, 'spin');
            spyOn($state, 'go');

            $httpBackend.expect("GET", coursesURL).respond(200, courses);
            loadController();
            $httpBackend.flush();
            $httpBackend.expect("POST", signUpURL).respond(400, {});
            $scope.signUp(user);
            $httpBackend.flush();
          });
        });

        describe('bad request', function() {

        });
      });
    });
  });
});