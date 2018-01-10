import { FLLScoreClient } from '../shared/interface';
export declare class WebProxy {
    readonly host: string;
    readonly infoPollingRate: number;
    readonly port: number;
    readonly servePort: number;
    readonly name: string;
    private server;
    private fllclient;
    private useWatchdog;
    private pollTest?;
    constructor(opts?: FLLScoreClient.IWebProxyOpts);
    startProxy(): Promise<boolean>;
}
