import { FLLScoreClient } from '../shared/interface';
export declare class WebProxy {
    readonly host: string;
    readonly port: number;
    readonly servePort: number;
    readonly name: string;
    private server;
    private fllclient;
    private useWatchdog;
    constructor(opts?: FLLScoreClient.IWebProxyOpts);
    startProxy(): Promise<boolean>;
}
