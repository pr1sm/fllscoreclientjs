/// <reference types="node" />
/// <reference types="socket.io-client" />
import { Socket } from 'net';
import EventEmitter = NodeJS.EventEmitter;
export declare namespace FLLScoreClient {
    /**
     * Contains scoring information for one team.
     */
    interface ITeamInfo {
        /**
         * The Team Number
         */
        number: number;
        /**
         * The Team Name
         */
        name: string;
        /**
         * An array of the three team score (-1 is used when the match has not been played)
         */
        scores: number[];
        /**
         * The highest score of the three team scores (-1 until a match has been played).
         */
        highScore: number;
    }
    /**
     * Contains schedule information for the event
     */
    interface IScheduleInfo {
        /**
         * The date when the scores were last updated.
         */
        lastUpdate: Date;
        /**
         * The number of teams in the event.
         */
        numberOfTeams: number;
        /**
         * The total number of matches for the event.
         */
        numberOfMatches: number;
        /**
         * THe number of matches that have been played during the event.
         */
        numberOfCompletedMatches: number;
    }
    /**
     * A single object containing all scoring information.
     */
    interface IScoreInfo {
        /**
         * The schedule information for the event.
         */
        scheduleInfo: IScheduleInfo;
        /**
         * An array of the team info, one per team at the event.
         */
        teamInfo: ITeamInfo[];
    }
    /**
     * A local client that can connect directly to the Scoring Software through a tcp socket.
     */
    interface IClient {
        /**
         * The date when the last update was received.
         */
        readonly lastUpdate?: Date;
        /**
         * The configuration options of this client.
         */
        readonly opts: IClientOpts;
        /**
         * The last received scoring info.
         */
        readonly scoreInfo?: IScoreInfo;
        /**
         * A number containing the status of this client.
         * 0 - Disconnected
         * 1 - Connecting
         * 2 - Connected
         */
        readonly status: number;
        /**
         * The underlying socket connection to the scoring server
         */
        readonly socket: Socket;
        /**
         * Connect to the scoring server based on the config options
         * @returns {Promise<string>} - Resolves to 'Connected' when connected or rejects with an error.
         */
        connect(): Promise<string>;
        /**
         * Send a ping command to the scoring server. This is used to verify the connection is still open.
         * @returns {Promise<string>} - Resolves to 'Echo' when connected or rejects with an error.
         */
        sendPing(): Promise<string>;
        /**
         * Request the last update from the scoring server. This can be compared to the existing lastUpdate
         * to see if new scoring info is available.
         * @returns {Promise<boolean>} - Resolves to true if new info is available, false if not. Rejects with an Error.
         */
        sendLastUpdate(): Promise<boolean>;
        /**
         * Request the scoring info from the scoring server. This is both returned in the promise and stored on the
         * client.
         * @returns {Promise<FLLScoreClient.IScoreInfo>} - Resolves to the current score info, rejects with an error.
         */
        sendScore(): Promise<IScoreInfo>;
        /**
         * Close the connection to the scoring server.
         * @returns {Promise<string>} - Resolves to 'Close' on successful close  or 'Closed with error'.
         */
        close(): Promise<string>;
    }
    /**
     * The configuration options for the local client.
     */
    interface IClientOpts {
        /**
         * The host to connect to (can be an ip address).
         * @default localhost
         */
        host?: string;
        /**
         * The name which the scoring software should register the client as.
         * @default FLLScoreClient
         */
        name?: string;
        /**
         * The port which the socket should connect.
         * @default 25002
         */
        port?: number;
        /**
         * Whether or not to start a watchdog heartbeat to automatically check the status of connection and
         * keep it alive. (should almost aways be true).
         * @default true
         */
        useWatchdog?: boolean;
    }
    /**
     * Web Client that connects to a Web Proxy through websockets.
     */
    interface IWebClient extends EventEmitter {
        /**
         * The underlying socket connection
         */
        readonly socket: SocketIOClient.Socket;
        /**
         * Request the last update from the proxy
         * @returns {Promise<Date>} - Resolves with the last update received by the proxy, rejects with an error.
         */
        getLastUpdate(): Promise<Date>;
        /**
         * Request the last scoring info from the proxy
         * @returns {Promise<FLLScoreClient.IScoreInfo>} - Resolves with the last scoreInfo from the proxy rejects with an error.
         */
        getScoreInfo(): Promise<IScoreInfo>;
    }
    /**
     * Configuration Options for the Web Proxy
     */
    interface IWebProxyOpts {
        /**
         * The rate at which to check for new updates (in seconds)
         * @default 30
         */
        infoPollingRate?: number;
        /**
         * The port on which to serve the proxy
         * @default 25003
         */
        servePort?: number;
        /**
         * The options for underlying local client.
         */
        socketOpts?: IClientOpts;
        /**
         * The underlying client connection.
         */
        socket?: IClient;
    }
    /**
     * The Web Proxy to provide browsers with scoring info through web sockets.
     */
    interface IWebProxy {
        /**
         * The rate at which to check for new updates (in seconds)
         * @default 30
         */
        readonly infoPollingRate: number;
        /**
         * The port on which to serve the proxy
         * @default 25003
         */
        readonly servePort: number;
        /**
         * The options for underlying local client.
         */
        readonly socketOpts: IClientOpts;
        /**
         * Start the proxy server and connect to the running scoring server.
         * @returns {Promise<boolean>} - Resolves to true when connected, false if connection couldn't be made.
         */
        startProxy(): Promise<boolean>;
    }
}
