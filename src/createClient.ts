import {ClientImpl} from "./clientImpl";
import {FLLScoreClient} from "./interface";

export function createClient(host?: string, port?: number, name?: string) : FLLScoreClient.Client {
    return new ClientImpl(host, port, name);
}