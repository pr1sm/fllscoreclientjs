var fllScoreClient = require('../dist/index');

var client = new fllScoreClient.Client('localhost', 8100);

client.connect().catch(function(err) {
    console.log('Rejected: ' + err.message);
});