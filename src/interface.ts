import {Socket} from "net";

export namespace FLLScoreClient {

    export enum ConnectionStatus {
        Disconnected,
        Connecting,
        Connected
    }

    export interface TeamInfo {
        number: number;
        name: string;
        scores: number[];
        highScore: number;
    }

    export interface ScheduleInfo {
        lastUpdate: Date;
        numberOfTeams: number;
        numberOfMatches: number;
        numberOfCompletedMatches: number;
    }

    export interface ScoreInfo {
        scheduleInfo: ScheduleInfo,
        teamInfo: TeamInfo[]
    }

    export interface Client {

        connect(): Promise<String>;

        sendPing(): Promise<String>;

        sendLastUpdate(): Promise<Date>;

        sendScore(): Promise<ScoreInfo>;

        close(): Promise<String>;

        host: string;
        name: string;
        port: number;
        lastUpdate?: Date;
        scoreInfo?: ScoreInfo;
        status: ConnectionStatus;
        socket: Socket;
    }
}
