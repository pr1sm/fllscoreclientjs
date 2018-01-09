import {WebServerImpl} from './webServerImpl';
import {ClientImpl} from './clientImpl';
import {FLLScoreClient} from './interface';

export function createClient(host?: string, port?: number,
                             name?: string, useWatchdog?: boolean): FLLScoreClient.IClient {
    return new ClientImpl(host, port, name, useWatchdog);
}

export function createWebServer(host?: string, port?: number,
                                name?: string, useWatchdog?: boolean): WebServerImpl {
    return new WebServerImpl(host, port, name, useWatchdog);
}