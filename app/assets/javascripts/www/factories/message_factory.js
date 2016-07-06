app.factory('Message', [
  'User',

  function (User) {

    function Message(options) {
      this.id = options.id,
      this.content = options.content,
      this.topic_id = options.topic_id
      this.author = options.user

      this.authorFullName = function () {
        return this.author.first_name + ' ' + this.author.last_name
      }

      this.authorIsUser = function () {
        return User.id === this.author.id
      }
    }

    return Message
  }
])