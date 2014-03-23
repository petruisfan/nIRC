#!/usr/bin/env node

var http = require('http');
var fs = require('fs');

http.createServer(function( request, response ) {
    var newFile = fs.createWriteStream('readme_copy.md');

    var bytes = request.headers['content-length'];
    var uploadedBytes = 0;

    request.pipe(newFile);

    request.on('data', function(chunk) {
        uploadedBytes += chunk.length;
        var progress = uploadedBytes / bytes * 100;
        response.write("progress: " + parseInt(progress) + "%\n");
    });

    request.on('end', function() {
        response.end("Uploaded!\n");
    });
}).listen(8080);

console.log("server listening on port 8080");
