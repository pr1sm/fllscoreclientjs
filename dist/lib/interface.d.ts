/// <reference types="node" />
import { Socket } from "net";
export declare namespace FLLScoreClient {
    enum ConnectionStatus {
        Disconnected = 0,
        Connecting = 1,
        Connected = 2,
    }
    interface TeamInfo {
        number: number;
        name: string;
        scores: number[];
        highScore: number;
    }
    interface ScheduleInfo {
        lastUpdate: Date;
        numberOfTeams: number;
        numberOfMatches: number;
        numberOfCompletedMatches: number;
    }
    interface ScoreInfo {
        scheduleInfo: ScheduleInfo;
        teamInfo: TeamInfo[];
    }
    interface Client {
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
