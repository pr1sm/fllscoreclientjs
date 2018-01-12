/// <reference types="socket.io" />
import { FLLScoreClient } from '../shared/interface';
export declare class WebProxy implements FLLScoreClient.IWebProxy {
    private static defaults(src, def);
    readonly infoPollingRate: number;
    readonly servePort: number;
    readonly socketOpts: FLLScoreClient.IClientOpts;
    server: SocketIO.Server;
    private clients;
    private opts;
    private fllclient;
    private pollTest?;
    private createdServer;
    constructor(opts?: FLLScoreClient.IWebProxyOpts);
    startProxy(): Promise<boolean>;
    stopProxy(): Promise<string>;
    private closeConnections();
    private setupClientListener();
}
