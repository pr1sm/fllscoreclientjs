var client = fllscoreclient.createWebClient('0.0.0.0', 8101);

client.on('lastUpdate', (date) => {
    console.log(date);
});

client.on('sendScore', (info) => {
    console.log(info);
});

client.getLastUpdate().then((date) => {
    console.log(date);
}).catch((err) => {
    console.error(err);
});

client.getScoreInfo().then((info) => {
    console.log(info);
}).catch((err) => {
    console.error(err);
});
