#!/usr/bin/env node

var express = require("express")
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server, { log: false });

app.use(express.static('./public'));

var participants = {};
var id = 0;

io.sockets.on('connection', function(client) {
    var clientId = 0;

    client.on('message', function (data) {
        console.log("Received: " ,data);
        data.name = participants[clientId];
        client.broadcast.emit("message", data);
    });
    client.on("login", function( data ) {
        console.log("Client " + data + " connected");
        participants[++id] = data;
        clientId = id
        client.emit('participants', participants);
        client.broadcast.emit('participants', participants);
    });
    client.on('logout', function () {
        if (participants[clientId]) {
            console.log("Client " + participants[clientId] + " disconnected");
            delete participants[clientId];
            client.broadcast.emit('participants', participants );
        }
    })
});

server.listen(3000, function() {
    console.log("Server started on port 3000");
});
