var fllScoreClient = require('fllscoreclient/dist/fllscoreclientproxy');

var client = fllScoreClient.createClient({host: 'localhost', port: 8100});

client.connect().then(function(res) {
    console.log(res);
    return client.sendPing();
}).then(function(res) {
    console.log(res);
    return client.sendLastUpdate();
}).then(function(res) {
    if (res) {
        console.log('Update is necessary');
    } else {
        console.log('No Update Needed');
    }
    console.log(client.lastUpdate.toISOString());
    return new Promise(function (resolve) {
        setTimeout(resolve, 5000);
    });
}).then(function() {
    return client.sendScore();
}).then(function(res) {
    console.log(JSON.stringify(res));
    return client.sendLastUpdate();
}).then(function(res) {
    if (res) {
        console.log('Update is necessary');
    } else {
        console.log('No Update Needed');
    }
    console.log(client.lastUpdate.toISOString());
    return client.close();
}).then(function(res) {
    console.log(res);
}).catch(function(err) {
    console.log('Rejected: ' + err.message);
});
