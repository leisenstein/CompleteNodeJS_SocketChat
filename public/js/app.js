 // access to JS files loaded in index.html above app.js
 var name = getQueryVariable('name') || 'Anonymous';
 var room = getQueryVariable('room');

 //defined when you load socket.io library above
var socket = io(); 

socket.on('connect', function() {
    console.log('Connected to socket.io server!');
    console.log(`${name} joined room: ${room}`);
    //$('.messages').append(`<p>${name} joined room: ${room} </p>`);
});

socket.on('message', function(message) {
    var momentTimestamp = moment.utc(message.timestamp);
    var $message = $('.messages');
    console.log('New message: ');
    console.log(message.text);  

    $message.append(`<p><strong>` +  `${message.name}` + ` ` + `${momentTimestamp.local().format('h:mm a')}`   + `</strong></p>`);
    $message.append(`<p>${message.text}</p>`);
    //$('.messages').append(`<p><strong>(` + `${momentTimestamp.local().format('h:mm a')}` + `</strong>) ${message.text}</p>`);
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