/// <reference types="node" />
import { Socket } from 'net';
import { FLLScoreClient } from '../shared/interface';
export declare class Client implements FLLScoreClient.IClient {
    private static defaults(src, def);
    lastUpdate?: Date;
    opts: FLLScoreClient.IClientOpts;
    scoreInfo?: FLLScoreClient.IScoreInfo;
    status: number;
    socket: Socket;
    private watchdogInterval;
    private connTest?;
    private callbackQueues;
    private messageBuffer;
    constructor(opts?: FLLScoreClient.IClientOpts);
    connect(): Promise<string>;
    sendPing(): Promise<string>;
    sendLastUpdate(): Promise<boolean>;
    sendScore(): Promise<FLLScoreClient.IScoreInfo>;
    close(): Promise<string>;
    private pushCallback(key, cb);
    private removeCallback(key, cb);
    private resetConnectionTest();
}
