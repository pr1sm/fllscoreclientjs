import { FLLScoreClient } from '../shared/interface';
import { WebProxy } from './webProxy';
declare function createClient(opts?: FLLScoreClient.IClientOpts): FLLScoreClient.IClient;
declare function createWebProxy(opts?: FLLScoreClient.IWebProxyOpts): WebProxy;
export { FLLScoreClient, createClient, createWebProxy };
