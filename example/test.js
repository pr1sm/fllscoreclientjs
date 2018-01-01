var fllScoreClient = require('../dist/index');

var client = new fllScoreClient.Client('localhost', 8100);

client.connect().then(function(res) {
    console.log(res);
    return client.sendPing();
}).then(function(res) {
    console.log(res);
    return client.sendLastUpdate();
}).then(function(res) {
    console.log(res.toString());
    console.log(client.lastUpdate.toISOString());
    return client.close();
}).then(function(res) {
    console.log(res);
}).catch(function(err) {
    console.log('Rejected: ' + err.message);
});
