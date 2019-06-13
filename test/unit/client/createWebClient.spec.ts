import { assert, expect } from 'chai';
import { createWebClient } from '../../../src/client/index';
import { WebClient } from '../../../src/client/webClient';
import * as FLLScoreClient from '../../../src/shared/interface';

export class CreateWebClientSpec {
    public static run() {
        describe('createWebClient', () => {
            let webClient: FLLScoreClient.IWebClient;

            afterEach(() => {
                if (webClient !== undefined) {
                    (webClient as WebClient).close();
                }
            });

            it('should construct a valid WebClient', () => {
                webClient = createWebClient();

                assert.isTrue(webClient instanceof WebClient);
                expect((webClient as WebClient).host).to.equal('localhost');
                expect((webClient as WebClient).port).to.equal(25003);
                assert.isDefined(webClient.socket);
                assert.isDefined(webClient.getLastUpdate);
                assert.isDefined(webClient.getScoreInfo);
            });

            it('should construct a valid WebClient with new host', () => {
                webClient = createWebClient('new-host');

                assert.isTrue(webClient instanceof WebClient);
                expect((webClient as WebClient).host).to.equal('new-host');
                expect((webClient as WebClient).port).to.equal(25003);
                assert.isDefined(webClient.socket);
                assert.isDefined(webClient.getLastUpdate);
                assert.isDefined(webClient.getScoreInfo);
            });

            it('should construct a valid WebClient with new port', () => {
                webClient = createWebClient('new-host', 42);

                assert.isTrue(webClient instanceof WebClient);
                expect((webClient as WebClient).host).to.equal('new-host');
                expect((webClient as WebClient).port).to.equal(42);
                assert.isDefined(webClient.socket);
                assert.isDefined(webClient.getLastUpdate);
                assert.isDefined(webClient.getScoreInfo);
            });

            it('should construct a valid WebClient with new host with port', () => {
                webClient = createWebClient('new-host:42', 1337);

                assert.isTrue(webClient instanceof WebClient);
                expect((webClient as WebClient).host).to.equal('new-host:42');
                expect((webClient as WebClient).port).to.equal(42);
                assert.isDefined(webClient.socket);
                assert.isDefined(webClient.getLastUpdate);
                assert.isDefined(webClient.getScoreInfo);
            });
        });
    }
}
