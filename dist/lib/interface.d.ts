/// <reference types="node" />
/// <reference types="socket.io-client" />
import { Socket } from 'net';
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
        host: string;
        name: string;
        port: number;
        lastUpdate?: Date;
        scoreInfo?: IScoreInfo;
        status: number;
        socket: Socket | SocketIOClient.Socket;
        connect(): Promise<string>;
        sendPing(): Promise<string>;
        sendLastUpdate(): Promise<Date>;
        sendScore(): Promise<IScoreInfo>;
        close(): Promise<string>;
    }
}
