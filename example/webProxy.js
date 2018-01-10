var fllScoreProxy = require('../dist/fllscoreclientproxy'); // Uncomment for dev version

var server = fllScoreProxy.createWebProxy({host: 'localhost', port: 8100, servePort: 8101});

server.startProxy().then((res) => {
    if (res) {
        console.log('Server Started...');
    } else {
        console.log('Server Unable to Start... try again');
    }
});