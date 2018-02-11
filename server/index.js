'use strict';

const socketPort = process.env.SOCKET_PORT || 2000;
const io = require('socket.io')(socketPort);

// Load & instantiate ZombiesGenerator class
const ZombiesGenerator = require('./zombies-generator');
const zombiesGenerator = new ZombiesGenerator();
zombiesGenerator.start(); // ZombiesGenerator scan

io.on('connection', function(socket){
    console.log('new client connected');

    socket.emit('mapZone', zombiesGenerator.zone);
    // Publish the covered zone when a new client is connected to the server

    zombiesGenerator.on('scanResfresh', function(zombies) {
        socket.emit('scanResfresh', zombies);
    });
    // When receiving an scanResfresh event from the zombiesGenerator,
    // emit a scanResfresh event to the client via the websocket

    zombiesGenerator.on('info', function(msg) {
        console.log(msg);
        socket.emit('info', msg);
    })
    // Publish zombiesGenerator log info to the client via the websocket

    socket.on('disconnect', function(){
        console.log('client disconnected');
    });
});
