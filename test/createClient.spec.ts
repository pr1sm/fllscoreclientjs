import { expect } from "chai";
import { createClient, FLLScoreClient } from "../src";
import { ClientImpl } from "../src/clientImpl";
import { Socket } from "net";

describe('createClient', () => {
    it('should return a valid Client with no parameters', () => {
        let client = createClient();
        expect(client instanceof ClientImpl).to.be.true;
        expect(client.host).to.equal('localhost');
        expect(client.port).to.equal(25002);
        expect(client.name).to.equal('FLLScoreClient');
        expect(client.status).to.equal(FLLScoreClient.ConnectionStatus.Disconnected);
        expect(client.lastUpdate).to.be.undefined;
        expect(client.scoreInfo).to.be.undefined;
        expect(client.socket instanceof Socket).to.be.true;
    });

    it('should return a valid Client with host parameter', () => {
        let client = createClient('new-host');
        expect(client instanceof ClientImpl).to.be.true;
        expect(client.host).to.equal('new-host');
        expect(client.port).to.equal(25002);
        expect(client.name).to.equal('FLLScoreClient');
        expect(client.status).to.equal(FLLScoreClient.ConnectionStatus.Disconnected);
        expect(client.lastUpdate).to.be.undefined;
        expect(client.scoreInfo).to.be.undefined;
        expect(client.socket instanceof Socket).to.be.true;
    });

    it('should return a valid Client with host and port parameters', () => {
        let client = createClient('new-host', 8080);
        expect(client instanceof ClientImpl).to.be.true;
        expect(client.host).to.equal('new-host');
        expect(client.port).to.equal(8080);
        expect(client.name).to.equal('FLLScoreClient');
        expect(client.status).to.equal(FLLScoreClient.ConnectionStatus.Disconnected);
        expect(client.lastUpdate).to.be.undefined;
        expect(client.scoreInfo).to.be.undefined;
        expect(client.socket instanceof Socket).to.be.true;
    });

    it('should return a valid Client with all parameters', () => {
        let client = createClient('new-host', 8080, 'new-name');
        expect(client instanceof ClientImpl).to.be.true;
        expect(client.host).to.equal('new-host');
        expect(client.port).to.equal(8080);
        expect(client.name).to.equal('new-name');
        expect(client.status).to.equal(FLLScoreClient.ConnectionStatus.Disconnected);
        expect(client.lastUpdate).to.be.undefined;
        expect(client.scoreInfo).to.be.undefined;
        expect(client.socket instanceof Socket).to.be.true;
    });
});
