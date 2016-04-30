var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
// create new server an use Express app as boilerplate
var http = require('http').Server(app);
// socket.io expects this format
var io = require('socket.io')(http);


app.use(express.static(__dirname + '/public'));

io.on('connection', function() {
    console.log('User connected via socket.io!');
});  // listen to events


http.listen(PORT, function() {
    console.log('Server started!');
});