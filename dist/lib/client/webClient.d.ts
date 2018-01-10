/// <reference types="node" />
/// <reference types="socket.io-client" />
import { EventEmitter } from 'events';
import { FLLScoreClient } from '../shared/interface';
export declare class WebClient extends EventEmitter implements FLLScoreClient.IWebClient {
    host: string;
    port: number;
    socket: SocketIOClient.Socket;
    private lastUpdate?;
    private scoreInfo?;
    constructor(host?: string, port?: number);
    getLastUpdate(): Promise<Date>;
    getScoreInfo(): Promise<FLLScoreClient.IScoreInfo>;
}
