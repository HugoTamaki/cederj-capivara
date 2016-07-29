app.factory('RoomEntryRequest', [
  'Room',

  function (Room) {

    function RoomEntryRequest(options) {
      this.id = options.id
      this.sender = {
        id: options.sender.id,
        firstName: options.sender.first_name,
        lastName: options.sender.last_name,
        email: options.sender.email
      }
      this.receiver = {
        id: options.receiver.id,
        firstName: options.receiver.first_name,
        lastName: options.receiver.last_name,
        email: options.receiver.email
      }
      this.room = {
        id: options.room.id,
        name: options.room.name
      }

      this.senderFullName = function () {
        return this.sender.firstName + ' ' + this.sender.lastName
      }

      this.receiverFullName = function () {
        return this.receiver.firstName + ' ' + this.receiver.lastName
      }
    }

    return RoomEntryRequest
  }
])