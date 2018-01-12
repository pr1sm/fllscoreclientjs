import * as chai from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import { expect } from "chai";
import { WebProxy } from '../src/proxy/webProxy';
import { FLLScoreClient } from '../src/shared/interface';
import {MockClient} from './mock/client';
import * as io from 'socket.io';

chai.use(sinonChai);

describe('WebProxy', () => {
    describe('constructor', () => {
        it('should construct with no parameters', () => {
            const proxy = new WebProxy();
            expect(proxy.socketOpts.host).to.equal('localhost');
            expect(proxy.socketOpts.name).to.equal('FLLScoreClient');
            expect(proxy.socketOpts.port).to.equal(25002);
            expect(proxy.socketOpts.useWatchdog).to.equal(true);
            expect(proxy.infoPollingRate).to.equal(30);
            expect(proxy.servePort).to.equal(25003);
        });

        it('should construct with socketOpts', () => {
            const proxy = new WebProxy({
                socketOpts: {
                    host: 'new-host',
                    name: 'new-name',
                    port: 42,
                    useWatchdog: false
                },
            });
            expect(proxy.socketOpts.host).to.equal('new-host');
            expect(proxy.socketOpts.name).to.equal('new-name');
            expect(proxy.socketOpts.port).to.equal(42);
            expect(proxy.socketOpts.useWatchdog).to.equal(false);
        });

        it('should construct with infoPollingRate', () => {
            const proxy = new WebProxy({infoPollingRate: 40});
            expect(proxy.infoPollingRate).to.equal(40);
        });

        it('should construct with servePort', () => {
            const proxy = new WebProxy({servePort: 42});
            expect(proxy.servePort).to.equal(42);
        });

        it('should construct with socketIO', () => {
            const socketIO = io();
            const proxy = new WebProxy({socketIO: socketIO});
            expect(proxy.createdServer).to.be.false;
        });

        it('should construct with socket', () => {
            const client = new MockClient({});
            const proxy = new WebProxy({
                socket: client,
                socketOpts: {
                    host: 'new-host',
                    name: 'new-name',
                    port: 42,
                    useWatchdog: false
                },
            });
            expect(proxy.socketOpts.host).to.equal('localhost');
            expect(proxy.socketOpts.name).to.equal('FLLScoreClient');
            expect(proxy.socketOpts.port).to.equal(25002);
            expect(proxy.socketOpts.useWatchdog).to.equal(true);
        });

        it('should set different port and servePort if they are the same', () => {
            const proxy = new WebProxy({
                servePort: 42,
                socketOpts: { port: 42 },
            });
            expect(proxy.socketOpts.port).to.equal(42);
            expect(proxy.servePort).to.equal(43);
        });
    });

    describe('startProxy', () => {
        let webProxy;
        const stubServer = () => {
            sinon.stub(webProxy.server, 'listen');
            sinon.stub(webProxy.server, 'emit');
            sinon.stub(webProxy.server, 'on');
        };

        it('should resolve true when socket connects', () => {
            const mockClient = new MockClient({});
            webProxy = new WebProxy({socket: mockClient});
            stubServer();
            return webProxy.startProxy().then((res) => {
                expect(res).to.be.true;
                return webProxy.stopProxy();
            });
        });

        it('should resolve true when socket cannot connect', () => {
            const mockClient = new MockClient({rejectConnect: true});
            webProxy = new WebProxy({socket: mockClient});
            stubServer();
            return webProxy.startProxy().then((res) => {
                expect(res).to.be.false;
                return webProxy.stopProxy();
            })
        });
    });

    describe('stopProxy', () => {
        let webProxy;
        const stubServer = () => {
            sinon.stub(webProxy.server, 'listen');
            sinon.stub(webProxy.server, 'emit');
            sinon.stub(webProxy.server, 'on');
        };

        it('should resolve when proxy has started', () => {
            const mockClient = new MockClient({});
            webProxy = new WebProxy({socket: mockClient});
            stubServer();
            return webProxy.startProxy().then((res) => {
                expect(res).to.be.true;
                return webProxy.stopProxy();
            });
        });

        it('should resolve when proxy hasn\'t been started', () => {
            const mockClient = new MockClient({});
            webProxy = new WebProxy({socket: mockClient});
            stubServer();
            return webProxy.stopProxy();
        });
    });
});
