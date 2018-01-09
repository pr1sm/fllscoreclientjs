import { WebServerImpl } from './webServerImpl';
import { FLLScoreClient } from './interface';
export declare function createClient(host?: string, port?: number, name?: string, useWatchdog?: boolean): FLLScoreClient.IClient;
export declare function createWebServer(host?: string, port?: number, name?: string, useWatchdog?: boolean): WebServerImpl;
