app.factory('Topic', [

  function () {

    function Topic(options) {
      this.id = options.id
      this.name = options.name
      this.content = options.content
      this.room_id = options.room_id
      this.messages = []
      this.author = options.user

      this.authorFullName = function () {
        return this.author.first_name + ' ' + this.author.last_name
      }
    }

    return Topic
  }
])