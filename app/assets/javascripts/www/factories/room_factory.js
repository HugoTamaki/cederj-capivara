capivaraFactories.factory('Room', [
  'User',

  function (User) {

    function Room(options) {
      this.id = options.id
      this.name = options.name
      this.topics = []
      this.author = options.user

      this.authorFullName = function () {
        return this.author.first_name + ' ' + this.author.last_name
      }

      this.authorIsUser = function () {
        return User.id === this.author.id
      }

      this.belongsToUserParticipatingRooms = function () {
        return _(User.room_ids).contains(this.id)
      }
    }

    return Room
  }
])