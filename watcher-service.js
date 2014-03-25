'use strict';

var fs = require('fs'),
    net = require('net'),
    filename,
    server;

filename = process.argv[2];

if (!filename) {
    throw Error('No target filename was specified.');
}

var mysql      = require('mysql');
var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : ''
});

db.connect();
db.query('use test1');

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
        var date = new Date();

        connection.write(JSON.stringify({
            type: 'changed',
            file: filename,
            timestamp: date.getTime()
        }) + '\n');

        var watcherRecord = {
            filename: filename,
            datetime: date
        }
        db.query('INSERT INTO watcher SET ?', watcherRecord, function(err, result) {
            // 
        });
    };


});

server.listen(5432, function() {
    console.log('Listening ...');
});
