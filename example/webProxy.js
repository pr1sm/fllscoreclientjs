var fllScoreProxy = require('fllscoreclient/dist/fllscoreclientproxy'); // Uncomment for dev version

var proxy = fllScoreProxy.createWebProxy({servePort: 8101, infoPollingRate: 3, socketOpts: {host: 'localhost', port: 8100}});

proxy.startProxy().then((res) => {
    if (res) {
        console.log('Server Started...');
    } else {
        console.log('Server Unable to Start... try again');
    }
});