
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

io.on('connection', function(socket){
  console.log('socket connected :: ' + socket.id);

  socket.on('user connect', function(user){
    //TODO check if user already exist
    socket.user = user;
    users[user] = user;
    console.log('socket bind user :: ' + socket.id + ' :: '+ user);
    console.log(users);
  });

  socket.on('user_join_room', function(room){
    socket.room = room;
    rooms[room].users[socket.user] = socket.user;
    users[socket.user].room = room;
    
    io.emit('update room', {
        users: users;
        rooms: rooms;
    });

    console.log('user ' + socket.user + ' join room' + socket.room);
    console.log(rooms[room]);
    console.log(users[user]);
  });

  socket.on('user_create_room', function(room){
    socket.room = room;
    rooms[room] = { room: room, users : {} };
    rooms[room].users[socket.user] = socket.user;
    users[socket.user].room = room;
    
    io.emit('update room', {
        users: users;
        rooms: rooms;
    });

    console.log('user ' + socket.user + ' create and join room' + socket.room);
    console.log(rooms[room]);
    console.log(users[user]);
  });

  socket.on('user_leave_room', function(room)){
    delete socket.room;
    delete rooms[room].users[socket.user];
    delete users[socket.user].room;
    if(Object.keys(rooms[room].users).lenght ===0 ){
      delete rooms[room];
    }

    io.emit('update room', {
        users: users;
        rooms: rooms;
    });

    console.log('user ' + socket.user + ' leave room' + socket.room);
    console.log(rooms[room]);
    console.log(users[user]);

  });
  
  socket.on('disconnect', function(){
    console.log('socket disconnected :: ' + socket.id + ' :: ' + socket.user );
    delete users[socket.user];
  });

});