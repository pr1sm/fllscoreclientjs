const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const fllScoreProxy = require('fllscoreclient/dist/fllscoreclientproxy');

const PORT = process.env.PORT || 5000;

const app = express();
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    next();
});

app.use('/', express.static(__dirname + '/web/'));

server = http.Server(app);
server.listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(server, {
    transports: ['polling', 'websocket'],
    pingInterval: 10000,
    pingTimeout: 5000,
    origins: '*:*',
});
const proxy = fllScoreProxy.createWebProxy({servePort: PORT, infoPollingRate: 30, socketIO: io, socketOpts: {host: 'localhost', port: 8200}});

proxy.startProxy().then((res) => {
    if (res) {
        console.log('Server Started...');
    } else {
        console.log('Server Unable to Start... try again');
    }
});
