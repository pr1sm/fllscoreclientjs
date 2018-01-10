import {FLLScoreClient} from '../shared/interface';
import {Client} from './client';
import {WebProxy} from './webProxy';

function createClient(opts?: FLLScoreClient.IClientOpts): FLLScoreClient.IClient {
    return new Client(opts);
}

function createWebProxy(opts?: FLLScoreClient.IWebProxyOpts): WebProxy {
    return new WebProxy(opts);
}

export { FLLScoreClient, createClient, createWebProxy };
