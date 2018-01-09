/// <reference types="node" />
import { Socket } from 'net';
import { FLLScoreClient } from './interface';
export declare class ClientImpl implements FLLScoreClient.IClient {
    host: string;
    port: number;
    name: string;
    lastUpdate?: Date;
    scoreInfo?: FLLScoreClient.IScoreInfo;
    status: number;
    socket: Socket;
    private useWatchdog;
    private watchdogInterval;
    private connTest?;
    constructor(host?: string, port?: number, name?: string, useWatchdog?: boolean);
    connect(): Promise<string>;
    sendPing(): Promise<string>;
    sendLastUpdate(): Promise<Date>;
    sendScore(): Promise<FLLScoreClient.IScoreInfo>;
    close(): Promise<string>;
    private resetConnectionTest();
}
