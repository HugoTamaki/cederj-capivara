app.factory('Room', [

  function () {

    function Room(options) {
      this.id = options.id,
      this.name = options.name,
      this.topics = []
    }

    return Room
  }
])