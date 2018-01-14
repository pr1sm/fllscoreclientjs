import { expect } from "chai";
import { createWebClient } from '../../src/client';
import { WebClient } from '../../src/client/webClient';
import {FLLScoreClient} from '../../src/shared/interface';

export class CreateWebClientSpec {
    public static run() {

        let webClient: FLLScoreClient.IWebClient;

        afterEach(() => {
            if(webClient !== undefined) {
                (webClient as WebClient).close();
            }
        });

        describe('createWebClient', () => {
            it('should construct a valid WebClient', () => {
                webClient = createWebClient();

                expect(webClient instanceof WebClient).to.be.true;
                expect((webClient as WebClient).host).to.equal('localhost');
                expect((webClient as WebClient).port).to.equal(25003);
                expect(webClient.socket).to.not.be.undefined;
                expect(webClient.getLastUpdate).to.not.be.undefined;
                expect(webClient.getScoreInfo).to.not.be.undefined;
            });

            it('should construct a valid WebClient with new host', () => {
                webClient = createWebClient('new-host');

                expect(webClient instanceof WebClient).to.be.true;
                expect((webClient as WebClient).host).to.equal('new-host');
                expect((webClient as WebClient).port).to.equal(25003);
                expect(webClient.socket).to.not.be.undefined;
                expect(webClient.getLastUpdate).to.not.be.undefined;
                expect(webClient.getScoreInfo).to.not.be.undefined;
            });

            it('should construct a valid WebClient with new port', () => {
                webClient = createWebClient('new-host', 42);

                expect(webClient instanceof WebClient).to.be.true;
                expect((webClient as WebClient).host).to.equal('new-host');
                expect((webClient as WebClient).port).to.equal(42);
                expect(webClient.socket).to.not.be.undefined;
                expect(webClient.getLastUpdate).to.not.be.undefined;
                expect(webClient.getScoreInfo).to.not.be.undefined;
            });
        });
    }
}
