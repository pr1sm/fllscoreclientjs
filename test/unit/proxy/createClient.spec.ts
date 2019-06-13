import { expect } from "chai";
import { createClient, FLLScoreClient } from "../../../src/proxy/index";
import { Client } from "../../../src/proxy/client";
import * as FLLScoreClientConstants from '../../../src/constants/index';
import { Socket } from "net";

export class CreateClientSpec {
    public static run() {
        describe('createClient', () => {
            it('should return a valid Client with no parameters', () => {
                let client = createClient();
                expect(client instanceof Client).to.be.true;
                expect(client.opts.host).to.equal('localhost');
                expect(client.opts.port).to.equal(25002);
                expect(client.opts.name).to.equal('FLLScoreClient');
                expect(client.status).to.equal(FLLScoreClientConstants.ConnectionStatus.Disconnected);
                expect(client.lastUpdate).to.be.undefined;
                expect(client.scoreInfo).to.be.undefined;
                expect(client.socket instanceof Socket).to.be.true;
            });

            it('should return a valid Client with host parameter', () => {
                let client = createClient({host: 'new-host'});
                expect(client instanceof Client).to.be.true;
                expect(client.opts.host).to.equal('new-host');
                expect(client.opts.port).to.equal(25002);
                expect(client.opts.name).to.equal('FLLScoreClient');
                expect(client.status).to.equal(FLLScoreClientConstants.ConnectionStatus.Disconnected);
                expect(client.lastUpdate).to.be.undefined;
                expect(client.scoreInfo).to.be.undefined;
                expect(client.socket instanceof Socket).to.be.true;
            });

            it('should return a valid Client with host and port parameters', () => {
                let client = createClient({host: 'new-host', port: 8080});
                expect(client instanceof Client).to.be.true;
                expect(client.opts.host).to.equal('new-host');
                expect(client.opts.port).to.equal(8080);
                expect(client.opts.name).to.equal('FLLScoreClient');
                expect(client.status).to.equal(FLLScoreClientConstants.ConnectionStatus.Disconnected);
                expect(client.lastUpdate).to.be.undefined;
                expect(client.scoreInfo).to.be.undefined;
                expect(client.socket instanceof Socket).to.be.true;
            });

            it('should return a valid Client with all parameters', () => {
                let client = createClient({host: 'new-host', port: 8080, name: 'new-name'});
                expect(client instanceof Client).to.be.true;
                expect(client.opts.host).to.equal('new-host');
                expect(client.opts.port).to.equal(8080);
                expect(client.opts.name).to.equal('new-name');
                expect(client.status).to.equal(FLLScoreClientConstants.ConnectionStatus.Disconnected);
                expect(client.lastUpdate).to.be.undefined;
                expect(client.scoreInfo).to.be.undefined;
                expect(client.socket instanceof Socket).to.be.true;
            });
        });
    }
}
