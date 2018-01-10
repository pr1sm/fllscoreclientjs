/// <reference types="node" />
import { Socket } from 'net';
import { FLLScoreClient } from '../shared/interface';
export declare class Client implements FLLScoreClient.IClient {
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
    constructor(opts?: FLLScoreClient.IClientOpts);
    connect(): Promise<string>;
    sendPing(): Promise<string>;
    sendLastUpdate(): Promise<boolean>;
    sendScore(): Promise<FLLScoreClient.IScoreInfo>;
    close(): Promise<string>;
    private resetConnectionTest();
}
