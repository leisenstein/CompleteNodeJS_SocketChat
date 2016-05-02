var PORT = process.env.PORT || 3000;
var moment = require('moment');
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
         message.timespamp = moment().valueOf();
         console.log('Message received: ' + message.text);
         // socket.broadcase.emit sends to all EXCEPT current connection
         io.emit('message', message); 
    });

    // custom event
    socket.emit('message', {
        name: 'System',
        text: 'Welcome to the chat application!',
        timestamp: moment().valueOf()
    });

});  // listen to events


http.listen(PORT, function() {
    console.log('Server started!');
});