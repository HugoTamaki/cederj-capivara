app.factory('Topic', [

  function () {

    function Topic(options) {
      this.id = options.id
      this.name = options.name
      this.content = options.content
      this.room_id = options.room_id
      this.messages = []
    }

    return Topic
  }
])