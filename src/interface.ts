import {Socket} from 'net';

export declare namespace FLLScoreClient {

    export interface ITeamInfo {
        number: number;
        name: string;
        scores: number[];
        highScore: number;
    }

    export interface IScheduleInfo {
        lastUpdate: Date;
        numberOfTeams: number;
        numberOfMatches: number;
        numberOfCompletedMatches: number;
    }

    export interface IScoreInfo {
        scheduleInfo: IScheduleInfo;
        teamInfo: ITeamInfo[];
    }

    export interface IClient {
        host: string;
        name: string;
        port: number;
        lastUpdate?: Date;
        scoreInfo?: IScoreInfo;
        status: number;
        socket: Socket| SocketIOClient.Socket;

        connect(): Promise<string>;

        sendPing(): Promise<string>;

        sendLastUpdate(): Promise<Date>;

        sendScore(): Promise<IScoreInfo>;

        close(): Promise<string>;
    }
}
