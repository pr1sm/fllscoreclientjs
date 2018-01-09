import * as io from 'socket.io';
import {FLLScoreClient} from '../shared/interface';
import {createClient} from './createServer';

export class WebServer {
    public host: string = 'localhost';
    public port: number = 25002;
    public name: string = 'FLLScoreClient';

    private server: SocketIO.Server;
    private fllclient: FLLScoreClient.IClient;
    private useWatchdog: boolean = true;

    constructor(host: string = 'localhost', port: number = 25002,
                name: string = 'FLLScoreClient', useWatchdog: boolean = true) {
        this.host = host;
        this.port = port;
        this.name = name;
        this.useWatchdog = useWatchdog;

        this.fllclient = createClient(this.host, this.port, this.name, this.useWatchdog);

        this.server = io();
        this.server.on('connection', (client: SocketIO.Socket) => {
            this.fllclient.socket.on('data', (data) => {
                console.log('forwarding to websocket:\n' + data);
                client.send(data);
            });

            client.on('message', (data: string) => {
                console.log('forwarding to socket:\n' + data);
                this.fllclient.socket.write(data);
            });
        });
    }

    public startServer(): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            this.fllclient.connect().then(() => {
                this.server.listen(this.fllclient.port + 1);
                resolve(true);
            }).catch(() => {
                resolve(false);
            });
        });
    }
}
