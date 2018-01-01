/// <reference types="node" />
import { Socket } from 'net';
export declare enum ConnectionStatus {
    Unknown = 0,
    Disconnected = 1,
    Connecting = 2,
    Connected = 3,
}
export interface IClient {
    connect(): Promise<String>;
    sendPing(): Promise<String>;
    close(): Promise<String>;
    host: string;
    name: string;
    port: number;
    status: ConnectionStatus;
    socket: Socket;
}
export declare class Client implements IClient {
    host: string;
    port: number;
    name: string;
    status: ConnectionStatus;
    socket: Socket;
    constructor(host?: string, port?: number, name?: string);
    connect(): Promise<String>;
    sendPing(): Promise<String>;
    close(): Promise<String>;
}
