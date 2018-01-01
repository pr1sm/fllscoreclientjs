/// <reference types="node" />
import { Socket } from 'net';
export declare enum ConnectionStatus {
    Unknown = 0,
    Disconnected = 1,
    Connecting = 2,
    Connected = 3,
}
export interface IScoreClient {
    connect(): Promise<String>;
    sendPing(): Promise<String>;
    host: string;
    port: number;
    status: ConnectionStatus;
    socket: Socket;
}
export declare class Client implements IScoreClient {
    host: string;
    port: number;
    status: ConnectionStatus;
    socket: Socket;
    constructor(host?: string, port?: number);
    connect(): Promise<String>;
    sendPing(): Promise<String>;
}
