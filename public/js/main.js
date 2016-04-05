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
  

  //logic control part


  function get_rooms() {
    socket.emit('request_rooms_info');
    
  }

  socket.on('message', function(rooms){
    $('#choose-topic .topics-area .topic').remove();
    console.log("got rooms info from server");
    for ( var new_room in rooms){
      var new_room_ele = '<div class="topic"><h4>' + new_room +'</h4><i class="fa fa-chevron-right"></i></div>';
      $('#choose-topic .topics-area').append(new_room_ele);
    }
  });

  function set_user_name() {
    user = $username_input.val().trim();
    if (user != '') {
      $login_page.hide();
      get_rooms();
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
  
  $('#choose-topic .topics-area').delegate('.topic','click', function() {
    var index = $('#choose-topic .topics-area .topic').index( this );
    console.log(index);
    room = $('#choose-topic .topics-area .topic')[index].textContent.trim();
    set_room();

    console.log(room);
  });

  $('#live-chat header').click(function() {
    $chat_page.hide();
    get_rooms();
    $topic_choose_page.show();
    $room_add.focus();
    room_set = false;
    user_leave_room();
  })

});