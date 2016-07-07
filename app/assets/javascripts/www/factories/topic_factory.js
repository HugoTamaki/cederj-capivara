app.factory('Topic', [
  'User',

  function (User) {

    function Topic(options) {
      this.id = options.id
      this.name = options.name
      this.content = options.content
      this.room = options.room
      this.messages = []
      this.author = options.user

      this.authorFullName = function () {
        return this.author.first_name + ' ' + this.author.last_name
      }

      this.authorIsUser = function () {
        return User.id === this.author.id
      }
    }

    return Topic
  }
])