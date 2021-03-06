 // access to JS files loaded in index.html above app.js
 var name = getQueryVariable('name') || 'Anonymous';
 var room = getQueryVariable('room') || 'General';

 //defined when you load socket.io library above
var socket = io(); 
console.log(`${name} joined room: ${room}`);
// jQuery to fill out h1 tag with room name

$('.room-title').text(`${room}`);


socket.on('connect', function() {
    console.log('Connected to socket.io server!');
    socket.emit('joinRoom', {
        name: name,
        room: room
    });
});

socket.on('message', function(message) {
    var momentTimestamp = moment.utc(message.timestamp);
    var $messages = $('.messages'); // UL
    var $message = $('<li class="list-group-item"></li>');


    console.log('New message: ');
    console.log(message.text);  

    $message.append(`<p><strong>` +  `${message.name}` + ` ` + `${momentTimestamp.local().format('h:mm a')}`   + `</strong></p>`);
    $message.append(`<p>${message.text}</p>`);
    $messages.append($message);
});

// Handles submitting a new message
var $form = jQuery('#message-form');

$form.on('submit', function (event) {
    event.preventDefault(); // handle submission on our own, not browser
    var $message = $('input[name=message]');
    socket.emit('message', {
        name: name,
        text: $message.val()
    });
    
    $message.val('');
});