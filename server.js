var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
// create new server an use Express app as boilerplate
var http = require('http').Server(app);
// socket.io expects this format
var io = require('socket.io')(http);


app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket) {
    console.log('User connected via socket.io!');

    socket.on('message', function (message) {
         console.log('Message received: ' + message.text);

         socket.broadcast.emit('message', message); 
    });
    // custom event
    socket.emit('message', {
        text: 'Welcome to the chat application!'
    });
});  // listen to events


http.listen(PORT, function() {
    console.log('Server started!');
});