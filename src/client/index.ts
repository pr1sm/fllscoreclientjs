import {FLLScoreClient} from '../shared/interface';
import {WebClient} from './webClient';

function createWebClient(host?: string, port?: number): FLLScoreClient.IWebClient {
    return new WebClient(host, port);
}

export { FLLScoreClient, createWebClient };
