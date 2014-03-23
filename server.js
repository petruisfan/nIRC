#!/usr/bin/env node

var express = require("express")
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server, { log: false });

app.use(express.static('./public'));

var participants = [];
var disconnects = 0;

io.sockets.on('connection', function(client) {
    var name = null;
    var index = -1;

    client.on('messages', function (data) {
        console.log("Received: " ,data);
        data.name = name;
        client.broadcast.emit("messages", data);
    });
    client.on("login", function( data ) {
        console.log("Client " + data.name + " connected");
        index = participants.push(data.name) - 1;
        name = data.name;
        client.emit('participants', { names: participants });
        client.broadcast.emit('participants', { names: participants });
    });
    client.on('logout', function () {
        if (name) {
            console.log("Client " + name + " disconnected");
            participants.splice( index - disconnects , 1 );
            client.broadcast.emit('participants', { names: participants} );
            disconnects++;
        }
    })
});

server.listen(3000);