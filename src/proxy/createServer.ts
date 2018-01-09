import {FLLScoreClient} from '../shared/interface';
import {Client} from './client';
import {WebServer} from './webServer';

export function createClient(host?: string, port?: number,
                             name?: string, useWatchdog?: boolean): FLLScoreClient.IClient {
    return new Client(host, port, name, useWatchdog);
}

export function createWebServer(host?: string, port?: number,
                                name?: string, useWatchdog?: boolean): WebServer {
    return new WebServer(host, port, name, useWatchdog);
}
