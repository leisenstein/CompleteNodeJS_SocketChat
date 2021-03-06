var PORT = process.env.PORT || 3000;
var moment = require('moment');
var express = require('express');
var app = express();
// create new server an use Express app as boilerplate
var http = require('http').Server(app);
// socket.io expects this format
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

var clientInfo = {};  // set to empty object so it can be used later

function sendCurrentUsers(socket) {
    var info = clientInfo[socket.id];
    var users = [];

    if(typeof info === 'undefined') {
        return;
    }

    Object.keys(clientInfo).forEach(function(socketId) {
        var userInfo = clientInfo[socketId];
        if(info.room === userInfo.room) {
            users.push(userInfo.name);
        }
    });

    socket.emit('message', {
        name: 'System',
        text: 'Current users: ' + users.join(', '),
        timestamp: moment().valueOf()
    });

}

io.on('connection', function(socket) {
    console.log('User connected via socket.io!');



    socket.on('disconnect', function () {
        var userData = clientInfo[socket.id];
        if(typeof userData !== 'undefined') {
            socket.leave(userData.room);
            io.to(userData.room).emit('message', {
                name: 'System',
                text:  userData.name + ' has left!',
                timestamp: moment().valueOf()
            });
            delete clientInfo[socket.id];
        }
    });

    socket.on('joinRoom', function(req) {
        clientInfo[socket.id] = req;  // sets req obj for each client identified by socket.id
        socket.join(req.room);
        socket.broadcast.to(req.room).emit('message', {
            name: 'System',
            text: req.name + ' has joined!',
            timestamp: moment().valueOf()
        });
    });



    socket.on('message', function (message) {    
         console.log('Message received: ' + message.text);
         
         if(message.text === '@currentUsers') {
            sendCurrentUsers(socket);
         } else {
            message.timespamp = moment().valueOf();
            // socket.broadcase.emit sends to all EXCEPT current connection
            // ONLY emit the MESSAGE to members in the same room as the current client connection
            io.to(clientInfo[socket.id].room).emit('message', message); 
         }
         
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