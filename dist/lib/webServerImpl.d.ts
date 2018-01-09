export declare class WebServerImpl {
    host: string;
    port: number;
    name: string;
    private server;
    private fllclient;
    private useWatchdog;
    constructor(host?: string, port?: number, name?: string, useWatchdog?: boolean);
    startServer(): Promise<boolean>;
}
