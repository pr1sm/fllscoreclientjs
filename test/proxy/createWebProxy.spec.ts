import {expect} from "chai";
import {createWebProxy, FLLScoreClient} from '../../src/proxy';
import {MockClient} from '../mock/client';
import {WebProxy} from '../../src/proxy/webProxy';

export class CreateWebProxySpec {
    public static run() {
        describe('createWebProxy', () => {
            it('should return a valid client with no parameters', () => {
                const proxy = createWebProxy();
                expect(proxy instanceof WebProxy).to.be.true;
                expect(proxy.socketOpts.host).to.equal('localhost');
                expect(proxy.socketOpts.name).to.equal('FLLScoreClient');
                expect(proxy.socketOpts.port).to.equal(25002);
                expect(proxy.socketOpts.useWatchdog).to.equal(true);
                expect(proxy.infoPollingRate).to.equal(30);
                expect(proxy.servePort).to.equal(25003);
            });

            it('should return a valid client with socketOpts', () => {
                const proxy = createWebProxy({
                    socketOpts: {
                        host: 'new-host',
                        name: 'new-name',
                        port: 42,
                        useWatchdog: false
                    },
                });
                expect(proxy instanceof WebProxy).to.be.true;
                expect(proxy.socketOpts.host).to.equal('new-host');
                expect(proxy.socketOpts.name).to.equal('new-name');
                expect(proxy.socketOpts.port).to.equal(42);
                expect(proxy.socketOpts.useWatchdog).to.equal(false);
            });

            it('should return a valid client with infoPollingRate', () => {
                const proxy = createWebProxy({infoPollingRate: 40});
                expect(proxy instanceof WebProxy).to.be.true;
                expect(proxy.infoPollingRate).to.equal(40);
            });

            it('should return a valid client with servePort', () => {
                const proxy = createWebProxy({servePort: 42});
                expect(proxy instanceof WebProxy).to.be.true;
                expect(proxy.servePort).to.equal(42);
            });

            it('should return a valid client with socket', () => {
                const client = new MockClient({});
                const proxy = createWebProxy({
                    socket: client,
                    socketOpts: {
                        host: 'new-host',
                        name: 'new-name',
                        port: 42,
                        useWatchdog: false
                    },
                });
                expect(proxy instanceof WebProxy).to.be.true;
                expect(proxy.socketOpts.host).to.equal('localhost');
                expect(proxy.socketOpts.name).to.equal('FLLScoreClient');
                expect(proxy.socketOpts.port).to.equal(25002);
                expect(proxy.socketOpts.useWatchdog).to.equal(true);
            });

            it('should set different port and servePort if they are the same', () => {
                const proxy = createWebProxy({
                    servePort: 42,
                    socketOpts: { port: 42 },
                });
                expect(proxy instanceof WebProxy).to.be.true;
                expect(proxy.socketOpts.port).to.equal(42);
                expect(proxy.servePort).to.equal(43);
            });
        });
    }
}
