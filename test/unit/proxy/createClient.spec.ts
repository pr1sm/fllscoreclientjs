import { assert, expect } from 'chai';
import { Socket } from 'net';
import * as FLLScoreClientConstants from '../../../src/constants/index';
import { Client } from '../../../src/proxy/client';
import { createClient } from '../../../src/proxy/index';

export class CreateClientSpec {
    public static run() {
        describe('createClient', () => {
            it('should return a valid Client with no parameters', () => {
                const client = createClient();
                assert.isTrue(client instanceof Client);
                expect(client.opts.host).to.equal('localhost');
                expect(client.opts.port).to.equal(25002);
                expect(client.opts.name).to.equal('FLLScoreClient');
                expect(client.status).to.equal(FLLScoreClientConstants.ConnectionStatus.Disconnected);
                assert.isUndefined(client.lastUpdate);
                assert.isUndefined(client.scoreInfo);
                assert.isTrue(client.socket instanceof Socket);
            });

            it('should return a valid Client with host parameter', () => {
                const client = createClient({host: 'new-host'});
                assert.isTrue(client instanceof Client);
                expect(client.opts.host).to.equal('new-host');
                expect(client.opts.port).to.equal(25002);
                expect(client.opts.name).to.equal('FLLScoreClient');
                expect(client.status).to.equal(FLLScoreClientConstants.ConnectionStatus.Disconnected);
                assert.isUndefined(client.lastUpdate);
                assert.isUndefined(client.scoreInfo);
                assert.isTrue(client.socket instanceof Socket);
            });

            it('should return a valid Client with host and port parameters', () => {
                const client = createClient({host: 'new-host', port: 8080});
                assert.isTrue(client instanceof Client);
                expect(client.opts.host).to.equal('new-host');
                expect(client.opts.port).to.equal(8080);
                expect(client.opts.name).to.equal('FLLScoreClient');
                expect(client.status).to.equal(FLLScoreClientConstants.ConnectionStatus.Disconnected);
                assert.isUndefined(client.lastUpdate);
                assert.isUndefined(client.scoreInfo);
                assert.isTrue(client.socket instanceof Socket);
            });

            it('should return a valid Client with all parameters', () => {
                const client = createClient({host: 'new-host', port: 8080, name: 'new-name'});
                assert.isTrue(client instanceof Client);
                expect(client.opts.host).to.equal('new-host');
                expect(client.opts.port).to.equal(8080);
                expect(client.opts.name).to.equal('new-name');
                expect(client.status).to.equal(FLLScoreClientConstants.ConnectionStatus.Disconnected);
                assert.isUndefined(client.lastUpdate);
                assert.isUndefined(client.scoreInfo);
                assert.isTrue(client.socket instanceof Socket);
            });
        });
    }
}
