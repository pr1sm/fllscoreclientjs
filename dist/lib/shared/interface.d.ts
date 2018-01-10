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
        readonly host: string;
        readonly name: string;
        readonly port: number;
        readonly lastUpdate?: Date;
        readonly scoreInfo?: IScoreInfo;
        readonly status: number;
        readonly socket: Socket;
        connect(): Promise<string>;
        sendPing(): Promise<string>;
        sendLastUpdate(): Promise<Date>;
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
        host?: string;
        name?: string;
        port?: number;
        servePort?: number;
        useWatchdog?: boolean;
    }
}
