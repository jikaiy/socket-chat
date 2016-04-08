
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000


server.listen(port, function() {
	console.log('Server listening on port %d', port);
});

app.use(express.static(__dirname + '/public'));


var users = {};
var rooms = {};
var socket_id_user_map = {}

// set up default room
function setup_default_room(){
  var list = ['Java is the best', 'C++/C is the best', 'Python is the best', 'PHP is the best', 'JavaScript is the best'];
  for (var i =0, size = list.length; i < size; i++){
    console.log(list[i]);
    rooms[list[i]] = { room: list[i], users : { admin : 'admin' } };
  }
  console.log(rooms)
} 

setup_default_room();


io.on('connection', function(socket){
  console.log('socket connected :: ' + socket.id);

  socket.on('user connect', function(user){
    //TODO check if user already exist
    socket.user = user;
    users[user] = user;
    socket_id_user_map[user] = socket.id;
    console.log('socket bind user :: ' + socket.id + ' :: '+ user);
    console.log(users);
  });

  socket.on('user_join_room', function(room){
    socket.room = room;
    rooms[room].users[socket.user] = socket.user;
    users[socket.user].room = room;
    
    socket.join(socket.room);
    io.to(socket.room).emit('user_joined', socket.user);

    console.log('user ' + socket.user + ' join room ' + socket.room);
    console.log(rooms);
  });

  socket.on('user_create_room', function(room){
    socket.room = room;
    rooms[room] = { room: room, users : {} };
    rooms[room].users[socket.user] = socket.user;
    users[socket.user].room = room;
    
    socket.send(rooms);
    socket.join(socket.room);
    io.to(socket.room).emit('user_joined', socket.user);
    
    console.log('user ' + socket.user + ' create and join room ' + socket.room);
    console.log(rooms);
  });

  socket.on('user_leave_room', function(room) {
    delete socket.room;
    delete rooms[room].users[socket.user];
    delete users[socket.user].room;
    if(Object.keys(rooms[room].users).length ===0 ){
      delete rooms[room];
      console.log( "room " + room + " has been deleted")
    }
    socket.send(rooms);
    socket.leave(socket.room);
    io.to(socket.room).emit('user_left', socket.user);

    console.log('user ' + socket.user + ' leave room ' + room);
    console.log(rooms);

  });

  socket.on('request_rooms_info', function(){
    console.log('client request rooms info');
    socket.send(rooms);
  });

  socket.on('user_send_message', function(message, hour, mins){
    console.log('server receive message::'+message);
    if( message.startsWith('@') ){
      var receiver = message.split(" ")[0].slice(1)
      var receiver_id = socket_id_user_map[receiver]
      console.log("send unicast message to " + receiver + "::" + receiver_id);
      if ( receiver_id ){
        socket.broadcast.to(socket_id_user_map[receiver]).emit('new_message', message, hour, mins, socket.user);
      } else {
        io.to(socket.room).emit('new_message', message, hour, mins, socket.user);
      }
      
    } else {
      io.to(socket.room).emit('new_message', message, hour, mins, socket.user);
    }
    
  });
  
  socket.on('user_tying', function(){
    console.log(socket.user + ' is typing');
    io.to(socket.room).emit('user_tying', socket.user);
  });

  socket.on('user_stop_typing', function(){
    console.log(socket.user + ' stop typing');
    io.to(socket.room).emit('user_stop_typing');
  });


  socket.on('disconnect', function(){
    console.log('socket disconnected :: ' + socket.id + ' :: ' + socket.user );
    delete users[socket.user];
  });



});