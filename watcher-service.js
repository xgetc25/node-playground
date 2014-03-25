'use strict';

var fs = require('fs'),
    net = require('net'),
    filename,
    server;

filename = process.argv[2];

if (!filename) {
    throw Error('No target filename was specified.');
}


server = net.createServer(function(connection) {
    var watcher;

    console.log('Connected.');
    connection.write(JSON.stringify({
        type: 'watching',
        file: filename
    }) + '\n');
    // watcher setup
    watcher = fs.watch(filename, writeMessage);

    connection.on('close', function() {
        console.log('disconnected.');
        watcher.close();
    });

    function writeMessage() {
        connection.write(JSON.stringify({
            type: 'changed',
            file: filename,
            timestamp: Date.now()
        }) + '\n');
    };


});

server.listen(5432, function() {
    console.log('Listening ...');
});