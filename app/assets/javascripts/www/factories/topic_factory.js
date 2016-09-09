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
      this.created_at = options.created_at
      this.updated_at = options.updated_at

      this.authorFullName = function () {
        return this.author.first_name + ' ' + this.author.last_name
      }

      this.authorIsUser = function () {
        return User.id === this.author.id
      }
    
      this.createdDate = function () {
        if (moment(this.created_at).add(3, 'days') > moment()) {
          return moment(this.created_at).fromNow()
        } else {
          return moment(this.created_at).format('DD/MM/YY')
        }
      }
    }

    return Topic
  }
])