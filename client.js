"use strict";
var net = require('net'),
    cjp = require('./cjp.js'),
    netClient = net.connect({
        port: 5432
    }),
    myClient = cjp.connect(netClient);

myClient.on('message', function(message) {
    console.log("Recived message: " , message);
});