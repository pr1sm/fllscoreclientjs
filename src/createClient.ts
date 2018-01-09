import {FLLScoreClient} from './interface';
import {WebClientImpl} from './webClientImpl';

export function createWebClient(host?: string, port?: number,
                                name?: string, useWatchdog?: boolean): FLLScoreClient.IClient {
    return new WebClientImpl(host, port, name, useWatchdog);
}
