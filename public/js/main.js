$(function(){

  var user;
  var user_set = false;
  var room;
  var room_set = false;
  var room_choose = false;

  var socket = io();

  var $window = $(window);
  var $login_page = $('#login');
  var $topic_choose_page = $('#choose-topic');
  var $chat_page = $('#live-chat');


  var $username_input = $('#login .username-input');
  var $room_choose =  $('#choose-topic .topic');
  var $room_add = $('#choose-topic .topic-name-input');

  function user_connect () {
    socket.emit('user connect', user);
  }

  function user_join_room () {
    if( room ){
      socket.emit('user_join_room', room);
    }
  }

  function user_create_room () {
    if( room ) {
      socket.emit('user_create_room', room);
    }
  }

  function user_leave_room () {
    socket.emit('user_leave_room', room);
  }
  
  // client response on socket
  socket.on('append_room', function(room){
    console.log("I am going to append something");
    var $new_topic = '<div class="topic"><h4>' + room +'</h4><i class="fa fa-chevron-right"></i></div>';
    $('#choose-topic .topics-area').append($new_topic);
  })

  //logic control part
  function set_user_name() {
    user = $username_input.val().trim();
    if (user != '') {
      $login_page.hide();
      $topic_choose_page.show();
      $room_add.focus();
      user_connect();
      user_set = true;
    }
  }

  function set_room() {
    if (room!= ''){
      $topic_choose_page.hide();
      $('#live-chat header h4').text(room);
      $chat_page.show();
      user_join_room();
      room_set = true;
    }
  }

  function add_room() {
    room = $room_add.val().trim();
    if (room!= ''){
      $topic_choose_page.hide();
      $('#live-chat header h4').text(room);
      $chat_page.show();
      user_create_room();
      room_set = true;
      $room_add.val('');
    }
  }


  //view control part
  $topic_choose_page.hide();
  $chat_page.hide();



  $window.keydown(function (event){
    if(event.which === 13){
      if (!user_set){
        set_user_name();
      } else if (user_set && !room_set ){
        add_room();
        console.log(room);
      }
    }
  });
  
  $room_choose.click(function() {
    var index = $room_choose.index( this );
    room = $room_choose[index].textContent.trim();
    set_room();
    console.log(room);
  });

  $('#live-chat header').click(function() {
    $chat_page.hide();
    $topic_choose_page.show();
    $room_add.focus();
    room_set = false;
    user_leave_room();
  })

});