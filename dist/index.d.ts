/// <reference types="node" />
import { Socket } from 'net';
export declare enum ConnectionStatus {
    Unknown = 0,
    Disconnected = 1,
    Connecting = 2,
    Connected = 3,
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
    scheduleInfo: ScheduleInfo;
    teamInfo: TeamInfo[];
}
export interface IClient {
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
export declare class Client implements IClient {
    host: string;
    port: number;
    name: string;
    lastUpdate?: Date;
    scoreInfo?: ScoreInfo;
    status: ConnectionStatus;
    socket: Socket;
    constructor(host?: string, port?: number, name?: string);
    connect(): Promise<String>;
    sendPing(): Promise<String>;
    sendLastUpdate(): Promise<Date>;
    sendScore(): Promise<ScoreInfo>;
    close(): Promise<String>;
}
