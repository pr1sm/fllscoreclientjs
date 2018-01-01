var fllScoreClient = require('../dist/index');

var client = new fllScoreClient.Client('localhost', 8100);

client.connect().then(function(res) {
    console.log(res);
}).then(function() {
    client.sendPing().then(function(res) {
        console.log(res);
    }).then(function() {
        client.close().then(function(res) {
            console.log(res);
        });
    });
}).catch(function(err) {
    console.log('Rejected: ' + err.message);
});