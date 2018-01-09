import { FLLScoreClient } from '../shared/interface';
import { WebServer } from './webServer';
declare function createClient(host?: string, port?: number, name?: string, useWatchdog?: boolean): FLLScoreClient.IClient;
declare function createWebServer(host?: string, port?: number, name?: string, useWatchdog?: boolean): WebServer;
export { FLLScoreClient, createClient, createWebServer };
