'use strict';

/*
 * Simple HTTP server to server static files
 */

const clientPort = process.env.CLIENT_PORT || 3000;
const http = require('http');
const fs = require('fs');

const html = fs.readFileSync('client/radar.html');
const js = fs.readFileSync('client/app.js');
const css = fs.readFileSync('client/style.css');
const zombiePng = fs.readFileSync('client/zombie.png');

http.createServer(function (req, res) {
    if (req.url === "/") {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(html);
    } else if (req.url === "/app.js") {
        res.writeHead(200, {'Content-Type': 'text/javascript'});
        res.end(js);
    } else if (req.url === "/style.css") {
        res.writeHead(200, {'Content-Type': 'text/css'});
        res.end(css);
    } else if (req.url === "/zombie.png") {
        res.writeHead(200, {'Content-Type': 'image/png'});
        res.end(zombiePng);
    }
}).listen(clientPort);
