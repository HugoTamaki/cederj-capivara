var Conf = {
  baseUrl: 'http://localhost:3000/api/v1/'
}

describe('CourseService', function() {
  var $q, $rootScope, $httpBackend, CourseService;

  beforeEach(module('capivara'));

  beforeEach(inject(function(_$q_, _$rootScope_, _$httpBackend_, _CourseService_) {
    $q = _$q_;
    $rootScope = _$rootScope_;
    CourseService = _CourseService_;
    $httpBackend = _$httpBackend_;
    $httpBackend.whenGET(/\.html$/).respond('');
    deferred = _$q_.defer();
  }));

  var coursesURL = 'http://localhost:3000/api/v1/courses';

  var responseCourses = [
    {
      id: 1,
      name: 'Test room'
    }
  ]

  describe('#getCourses', function() {
    describe('success', function() {
      beforeEach(function() {
        $httpBackend.expect('GET', coursesURL).respond(200, {courses: responseCourses})
      });

      it('gets courses', function() {
        var courses

        CourseService.getCourses()
          .then(function(response) {
            courses = response.courses
          })

        $httpBackend.flush()
        expect(courses).toEqual(responseCourses)
      })
    });

    describe('failure', function() {
      beforeEach(function() {
        $httpBackend.expect('GET', coursesURL).respond(400, {error: 'some error'})
      });

      it('defers error', function() {
        var error;

        CourseService.getCourses()
          .catch(function(response) {
            error = response;
          })

        $httpBackend.flush();
        expect(error).toEqual('some error');
      });
    });
  });
});