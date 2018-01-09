import { expect } from "chai";
import { createClient, FLLScoreClient } from "../src/proxy";
import { Client } from "../src/proxy/client";
import { FLLScoreClientConstants } from '../src/shared/contants';
import { Socket } from "net";

describe('createClient', () => {
    it('should return a valid Client with no parameters', () => {
        let client = createClient();
        expect(client instanceof Client).to.be.true;
        expect(client.host).to.equal('localhost');
        expect(client.port).to.equal(25002);
        expect(client.name).to.equal('FLLScoreClient');
        expect(client.status).to.equal(0);
        expect(client.lastUpdate).to.be.undefined;
        expect(client.scoreInfo).to.be.undefined;
        expect(client.socket instanceof Socket).to.be.true;
    });

    it('should return a valid Client with host parameter', () => {
        let client = createClient('new-host');
        expect(client instanceof Client).to.be.true;
        expect(client.host).to.equal('new-host');
        expect(client.port).to.equal(25002);
        expect(client.name).to.equal('FLLScoreClient');
        expect(client.status).to.equal(FLLScoreClientConstants.ConnectionStatus.Disconnected);
        expect(client.lastUpdate).to.be.undefined;
        expect(client.scoreInfo).to.be.undefined;
        expect(client.socket instanceof Socket).to.be.true;
    });

    it('should return a valid Client with host and port parameters', () => {
        let client = createClient('new-host', 8080);
        expect(client instanceof Client).to.be.true;
        expect(client.host).to.equal('new-host');
        expect(client.port).to.equal(8080);
        expect(client.name).to.equal('FLLScoreClient');
        expect(client.status).to.equal(FLLScoreClientConstants.ConnectionStatus.Disconnected);
        expect(client.lastUpdate).to.be.undefined;
        expect(client.scoreInfo).to.be.undefined;
        expect(client.socket instanceof Socket).to.be.true;
    });

    it('should return a valid Client with all parameters', () => {
        let client = createClient('new-host', 8080, 'new-name');
        expect(client instanceof Client).to.be.true;
        expect(client.host).to.equal('new-host');
        expect(client.port).to.equal(8080);
        expect(client.name).to.equal('new-name');
        expect(client.status).to.equal(FLLScoreClientConstants.ConnectionStatus.Disconnected);
        expect(client.lastUpdate).to.be.undefined;
        expect(client.scoreInfo).to.be.undefined;
        expect(client.socket instanceof Socket).to.be.true;
    });
});
