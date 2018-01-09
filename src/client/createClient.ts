import {FLLScoreClient} from '../shared/interface';
import {WebClient} from './webClient';

export function createWebClient(host?: string, port?: number,
                                name?: string, useWatchdog?: boolean): FLLScoreClient.IWebClient {
    return new WebClient(host, port, name, useWatchdog);
}
