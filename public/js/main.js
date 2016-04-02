$(function(){

  var user;
  var room;
  var socket = io.();

  var $username_input = $('#login .username-input').val();
  var $room_choose;
  //var $room_choose = $().text(); //TODO here, how to select from html
  var $room_add = $('#choose-topic .topic-name-input').val();

  function user_connect () {
    user = $username_input;
    socket.emit('user connect', user);
  }

  function user_join_room () {
    room = $room_choose;
    if( room ) {
      socket.emit('user join room', room);
    }
  }

  function user_create_room () {
    room = $room_add;
    if( room ) {
      socket.emit('user create room', room);
    }
  }

  function user_leave_room () {
    socket.emit('user leave room', room);
  }


});