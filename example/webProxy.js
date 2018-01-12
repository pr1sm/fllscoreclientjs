var fllScoreProxy = require('fllscoreclient/dist/fllscoreclientproxy');

var proxy = fllScoreProxy.createWebProxy({servePort: 8100, infoPollingRate: 3, socketOpts: {host: 'localhost', port: 8200}});

proxy.startProxy().then((res) => {
    if (res) {
        console.log('Server Started...');
    } else {
        console.log('Server Unable to Start... try again');
    }
});
