"use strict";
var events = require('events'),
    util = require('util');

function CustomJSONProtocol(stream) {
    events.EventEmitter.call(this);
    var self = this;
    
    var buffer = '';
    stream.on('data', function(data) {
        buffer += data;
        var boundary = buffer.indexOf('}');
        while (boundary !== -1) {
            var input = buffer.substr(0, boundary+1);
            buffer = buffer.substr(boundary + 1);
            self.emit('message', JSON.parse(input));
            boundary = buffer.indexOf('}');
        }
    });
}

util.inherits(CustomJSONProtocol, events.EventEmitter);

exports.CustomJSONProtocol = CustomJSONProtocol;
exports.connect = function(stream) {
    return new CustomJSONProtocol(stream);
};