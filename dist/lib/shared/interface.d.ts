/// <reference types="node" />
/// <reference types="socket.io-client" />
import { Socket } from 'net';
import EventEmitter = NodeJS.EventEmitter;
export declare namespace FLLScoreClient {
    interface ITeamInfo {
        number: number;
        name: string;
        scores: number[];
        highScore: number;
    }
    interface IScheduleInfo {
        lastUpdate: Date;
        numberOfTeams: number;
        numberOfMatches: number;
        numberOfCompletedMatches: number;
    }
    interface IScoreInfo {
        scheduleInfo: IScheduleInfo;
        teamInfo: ITeamInfo[];
    }
    interface IClient {
        readonly lastUpdate?: Date;
        readonly opts: IClientOpts;
        readonly scoreInfo?: IScoreInfo;
        readonly status: number;
        readonly socket: Socket;
        connect(): Promise<string>;
        sendPing(): Promise<string>;
        sendLastUpdate(): Promise<boolean>;
        sendScore(): Promise<IScoreInfo>;
        close(): Promise<string>;
    }
    interface IClientOpts {
        host?: string;
        name?: string;
        port?: number;
        useWatchdog?: boolean;
    }
    interface IWebClient extends EventEmitter {
        readonly socket: SocketIOClient.Socket;
        getLastUpdate(): Promise<Date>;
        getScoreInfo(): Promise<IScoreInfo>;
    }
    interface IWebProxyOpts {
        infoPollingRate?: number;
        servePort?: number;
        socketOpts?: IClientOpts;
        socket?: IClient;
    }
    interface IWebProxy {
        readonly infoPollingRate: number;
        readonly servePort: number;
        readonly socketOpts: IClientOpts;
        startProxy(): Promise<boolean>;
    }
}
