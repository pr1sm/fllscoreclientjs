/// <reference types="node" />
import { Socket } from "net";
import { FLLScoreClient } from "./interface";
export declare class ClientImpl implements FLLScoreClient.Client {
    host: string;
    port: number;
    name: string;
    lastUpdate?: Date;
    scoreInfo?: FLLScoreClient.ScoreInfo;
    status: FLLScoreClient.ConnectionStatus;
    socket: Socket;
    private watchdogInterval;
    private connTest?;
    constructor(host?: string, port?: number, name?: string);
    connect(): Promise<String>;
    sendPing(): Promise<String>;
    sendLastUpdate(): Promise<Date>;
    sendScore(): Promise<FLLScoreClient.ScoreInfo>;
    close(): Promise<String>;
    private resetConnectionTest();
}
