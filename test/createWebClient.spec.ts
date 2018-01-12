import { expect } from "chai";
import { createWebClient } from '../src/client';
import { WebClient } from '../src/client/webClient';

describe.skip('createWebClient', () => {
    it('should construct a valid WebClient', () => {
        const webClient = createWebClient();

        expect(webClient instanceof WebClient).to.be.true;
        expect((webClient as WebClient).host).to.equal('localhost');
        expect((webClient as WebClient).port).to.equal(25003);
        expect(webClient.socket).to.not.be.undefined;
        expect(webClient.getLastUpdate).to.not.be.undefined;
        expect(webClient.getScoreInfo).to.not.be.undefined;
    });

    it('should construct a valid WebClient with new host', () => {
        const webClient = createWebClient('new-host');

        expect(webClient instanceof WebClient).to.be.true;
        expect((webClient as WebClient).host).to.equal('new-host');
        expect((webClient as WebClient).port).to.equal(25003);
        expect(webClient.socket).to.not.be.undefined;
        expect(webClient.getLastUpdate).to.not.be.undefined;
        expect(webClient.getScoreInfo).to.not.be.undefined;
    });

    it('should construct a valid WebClient with new port', () => {
        const webClient = createWebClient('new-host', 42);

        expect(webClient instanceof WebClient).to.be.true;
        expect((webClient as WebClient).host).to.equal('new-host');
        expect((webClient as WebClient).port).to.equal(42);
        expect(webClient.socket).to.not.be.undefined;
        expect(webClient.getLastUpdate).to.not.be.undefined;
        expect(webClient.getScoreInfo).to.not.be.undefined;
    });
});