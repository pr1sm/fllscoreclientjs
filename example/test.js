var fllScoreClient = require('../dist/index');

var client = new fllScoreClient.Client('localhost', 8100);

client.connect().then(function() {
    console.log('Connected');
}).then(function() {
    client.close().then(function() {
        console.log('Closed');
    });
}).catch(function(err) {
    console.log('Rejected: ' + err.message);
});