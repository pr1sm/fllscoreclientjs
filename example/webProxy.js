var fllScoreProxy = require('../dist/fllscoreclientproxy'); // Uncomment for dev version

var proxy = fllScoreProxy.createWebProxy({host: 'localhost', port: 8100, servePort: 8101, infoPollingRate: 3});

proxy.startProxy().then((res) => {
    if (res) {
        console.log('Server Started...');
    } else {
        console.log('Server Unable to Start... try again');
    }
});