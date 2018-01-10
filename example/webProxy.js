var fllScoreClient = require('../dist/fllscoreclientproxy'); // Uncomment for dev version

var server = fllScoreClient.createWebServer('localhost', 8100);

server.startServer().then((res) => {
    if (res) {
        console.log('Server Started...');
    } else {
        console.log('Server Unable to Start... try again');
    }
});