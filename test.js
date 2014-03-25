"use strict";
var net = require('net'),
    server;

server = net.createServer(function(connection) {
    console.log('Subscriber connected');
    // send the first chunk immediately
    connection.write(
        '{"changed":"1358175758495","file":"targ'
    );
    // after a one second delay, send the other chunk
    var timer = setTimeout(function() {
        connection.write('et.txt" }' + '\n { "changed":"2258175758495","file":"another.txt"}');
        connection.end();
    }, 1000);
    // clear timer when the connection ends
    connection.on('end', function() {
        clearTimeout(timer);
        console.log('Subscriber disconnected');
    });
});

server.listen(5432, function() {
    console.log('Test server listening for subscribers...');
});