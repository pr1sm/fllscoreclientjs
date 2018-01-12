const fllscoreclient = window.fllscoreclient;

window.onload = function() {
    const client = fllscoreclient.createWebClient('0.0.0.0', 8100);
    const ticker = document.getElementById('ticker');

    client.on('lastUpdate', (date) => {
        console.log(date);
    });

    client.once('scoreInfo', () => {
        ticker.className = 'ticker';
    });

    client.on('scoreInfo', (info) => {
        info.teamInfo.forEach((team) => {
            const content = '' + team.number + ' | ' + team.name + ' | '
                + team.highScore + ' | ' + team.scores[0] + ' | ' + team.scores[1]
                + ' | ' + team.scores[2];

            let tickerItem = document.getElementById(team.number.toString());
            if (tickerItem === null) {
                tickerItem = document.createElement('div');
                tickerItem.className = 'ticker__item';
                tickerItem.id = team.number.toString();
                ticker.appendChild(tickerItem);
            }
            tickerItem.innerText = content;
        });
    });
};
