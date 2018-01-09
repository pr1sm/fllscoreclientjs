import { FLLScoreClient } from '../shared/interface';
import { WebServer } from './webServer';
export declare function createClient(host?: string, port?: number, name?: string, useWatchdog?: boolean): FLLScoreClient.IClient;
export declare function createWebServer(host?: string, port?: number, name?: string, useWatchdog?: boolean): WebServer;
