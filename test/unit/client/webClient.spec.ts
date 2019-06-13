import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as socketIO from 'socket.io';

import {assert, expect} from 'chai';

import {WebClient} from '../../../src/client/webClient';
import * as FLLScoreClient from '../../../src/shared/interface';

chai.use(sinonChai);

export class WebClientSpec {
    public static run() {
        describe('WebClient', () => {
            let server: SocketIO.Server;
            let webClient: WebClient;

            beforeEach(() => {
                server = socketIO();
                server.listen(25003);
            });

            afterEach((done) => {
                if (webClient !== undefined) {
                    webClient.close();
                }

                server.close(done);
            });

            describe('constructor', () => {
                it('should construct with default parameters', () => {
                    webClient = new WebClient();

                    assert.isTrue(webClient instanceof WebClient);
                    expect((webClient as WebClient).host).to.equal('localhost');
                    expect((webClient as WebClient).port).to.equal(25003);
                    assert.isDefined(webClient.socket);
                    assert.isDefined(webClient.getLastUpdate);
                    assert.isDefined(webClient.getScoreInfo);
                });

                it('should construct new host', () => {
                    webClient = new WebClient('new-host');

                    assert.isTrue(webClient instanceof WebClient);
                    expect((webClient as WebClient).host).to.equal('new-host');
                    expect((webClient as WebClient).port).to.equal(25003);
                    assert.isDefined(webClient.socket);
                    assert.isDefined(webClient.getLastUpdate);
                    assert.isDefined(webClient.getScoreInfo);
                });

                it('should construct new port', () => {
                    webClient = new WebClient('new-host', 42);

                    assert.isTrue(webClient instanceof WebClient);
                    expect((webClient as WebClient).host).to.equal('new-host');
                    expect((webClient as WebClient).port).to.equal(42);
                    assert.isDefined(webClient.socket);
                    assert.isDefined(webClient.getLastUpdate);
                    assert.isDefined(webClient.getScoreInfo);
                });

                it('should construct new host:port combo', () => {
                    webClient = new WebClient('new-host:42', 1337);

                    assert.isTrue(webClient instanceof WebClient);
                    expect((webClient as WebClient).host).to.equal('new-host:42');
                    expect((webClient as WebClient).port).to.equal(42);
                    assert.isDefined(webClient.socket);
                    assert.isDefined(webClient.getLastUpdate);
                    assert.isDefined(webClient.getScoreInfo);
                });

                it('should notify consumers of connection on Connect', () => {
                    const consoleSpy = sinon.spy(console, 'info');

                    webClient = new WebClient();
                    webClient.socket.emit('connect');

                    expect(consoleSpy.calledOnce);
                    expect(consoleSpy.calledWith('Connected'));

                    consoleSpy.restore();
                });

                it('should notify consumers of disconnecting on Disconnect', () => {
                    const consoleSpy = sinon.spy(console, 'info');

                    webClient = new WebClient();
                    webClient.socket.emit('disconnect');

                    expect(consoleSpy.calledOnce);
                    expect(consoleSpy.calledWith('Disconnected'));

                    consoleSpy.restore();
                });

                it('should notify consumers of new lastUpdate data', () => {
                    const dateCmp = new Date('11/10/2017 7:52:40 AM');

                    webClient = new WebClient();
                    // const emitSpy = sinon.spy(webClient, 'emit');

                    webClient.socket.on('lastUpdate', (data) => {
                        console.log(`TEST: ${data}`);
                    });

                    webClient.on('lastUpdate', (data) => {
                        console.log(`TEST: ${data}`);
                    });

                    webClient.socket.emit('lastUpdate', dateCmp.toISOString());

                    // expect(emitSpy.calledOnce);
                    // expect(emitSpy.calledWith('lastUpdate', dateCmp.toISOString()));
                    //
                    // emitSpy.restore();
                });

                it('should notify consumers of error with lastUpdate data', () => {
                    const errorCmp = new Error('lastUpdateError');
                    const consoleSpy = sinon.spy(console, 'error');

                    webClient = new WebClient();
                    const emitSpy = sinon.spy(webClient, 'emit');

                    webClient.socket.emit('lastUpdate', errorCmp);

                    expect(emitSpy.calledOnce);
                    expect(emitSpy.calledWith('lastUpdate', errorCmp));
                    expect(consoleSpy.calledOnce);
                    expect(consoleSpy.calledWith(errorCmp));

                    emitSpy.restore();
                    consoleSpy.restore();
                });

                it('should notify consumers of new scoreInfo data', () => {
                    webClient = new WebClient();

                    const scoreInfo: FLLScoreClient.IScoreInfo = {
                        scheduleInfo: {
                            lastUpdate: new Date('11/10/2017 7:52:40 AM'),
                            numberOfCompletedMatches: 6,
                            numberOfMatches: 36,
                            numberOfTeams: 12,
                        },
                        teamInfo: [
                            {number: 16449, name: 'Dolphin Spiders', highScore: 310, scores: [310, -1, -1]},
                            {number: 17557, name: 'Crimson Flying', highScore: 145, scores: [145, -1, -1]},
                            {number: 23402, name: 'Striking Heroes', highScore: 270, scores: [270, -1, -1]},
                            {number: 30150, name: 'Lightning Spanners', highScore: 275, scores: [275, -1, 245]},
                            {number: 33256, name: 'Alpha Secret Agents', highScore: -1, scores: [-1, -1, -1]},
                            {number: 36131, name: 'Ice Mutants', highScore: 205, scores: [205, -1, -1]},
                            {number: 41714, name: 'Muffin Bandits', highScore: -1, scores: [-1, -1, -1]},
                            {number: 45406, name: 'Venomous Slammers', highScore: -1, scores: [-1, -1, -1]},
                            {number: 48551, name: 'Sneaky Falcons', highScore: -1, scores: [-1, -1, -1]},
                            {number: 61655, name: 'Extreme Dragons', highScore: -1, scores: [-1, -1, -1]},
                            {number: 74638, name: 'Butterfly Racoons', highScore: -1, scores: [-1, -1, -1]},
                            {number: 90436, name: 'Fire Bandits, highScore: ', highScore: -1, scores: [-1, -1, -1]},
                        ],
                    };
                    const emitSpy = sinon.spy(webClient, 'emit');

                    webClient.socket.emit('scoreInfo', scoreInfo);

                    expect(emitSpy.calledOnce);
                    expect(emitSpy.calledWith('scoreInfo', scoreInfo));

                    emitSpy.restore();
                });

                it('should notify consumers of error with scoreInfo data', () => {
                    webClient = new WebClient();

                    const errorCmp = new Error('scoreInfoError');
                    const emitSpy = sinon.spy(webClient, 'emit');
                    const consoleSpy = sinon.spy(console, 'error');

                    webClient.socket.emit('scoreInfo', errorCmp);

                    expect(emitSpy.calledOnce);
                    expect(emitSpy.calledWith('scoreInfo', errorCmp));
                    expect(consoleSpy.calledOnce);
                    expect(consoleSpy.calledWith(errorCmp));

                    emitSpy.restore();
                    consoleSpy.restore();
                });
            });

            describe('getLastUpdate', () => {
                let emitStub;

                const dateCmp = new Date('11/10/2017 7:52:40 AM');

                beforeEach(() => {
                    webClient = new WebClient();
                    emitStub = sinon.stub(webClient.socket, 'emit');
                    emitStub.callsFake((ev, m, cb) => {
                        if (ev === 'sendLastUpdate') {
                            expect(m.toString()).to.equal('please');
                            cb('11/10/2017 7:52:40 AM');
                        }
                    });
                });

                afterEach(() => {
                    emitStub.restore();
                });

                it('should request lastUpdate when it is undefined', () => {
                    return webClient.getLastUpdate().then((res) => {
                        expect(res).to.equalDate(dateCmp);
                        expect(emitStub).to.have.callCount(1);
                    });
                });

                it('should resolve to lastUpdate when it is not undefined', () => {
                    return webClient.getLastUpdate().then((res) => {
                        expect(res).to.equalDate(dateCmp);
                        expect(emitStub).to.have.callCount(1);
                        return webClient.getLastUpdate();
                    }).then((res) => {
                        expect(res).to.equalDate(dateCmp);
                        expect(emitStub).to.have.callCount(1);
                    });
                });

                it('should reject when an error is sent', () => {
                    emitStub.resetBehavior();
                    emitStub.callsFake((ev, m, cb) => {
                        if (ev === 'sendLastUpdate') {
                            expect(m.toString()).to.equal('please');
                            cb(new Error('lastUpdateError'));
                        }
                    });

                    return webClient.getLastUpdate().catch((err: Error) => {
                        expect(err.message).to.equal('lastUpdateError');
                    });
                });
            });

            describe('getScoreInfo', () => {
                let emitStub;

                beforeEach(() => {
                    webClient = new WebClient();
                    emitStub = sinon.stub(webClient.socket, 'emit');
                    emitStub.callsFake((ev, m, cb) => {
                        if (ev === 'sendScoreInfo') {
                            expect(m.toString()).to.equal('please');
                            const info: FLLScoreClient.IScoreInfo = {
                                scheduleInfo: {
                                    lastUpdate: new Date('11/10/2017 7:52:40 AM'),
                                    numberOfCompletedMatches: 6,
                                    numberOfMatches: 36,
                                    numberOfTeams: 12,
                                },
                                teamInfo: [
                                    {number: 16449, name: 'Dolphin Spiders', highScore: 310, scores: [310, -1, -1]},
                                    {number: 17557, name: 'Crimson Flying', highScore: 145, scores: [145, -1, -1]},
                                    {number: 23402, name: 'Striking Heroes', highScore: 270, scores: [270, -1, -1]},
                                    {number: 30150, name: 'Lightning Spanners', highScore: 275, scores: [275, -1, 245]},
                                    {number: 33256, name: 'Alpha Secret Agents', highScore: -1, scores: [-1, -1, -1]},
                                    {number: 36131, name: 'Ice Mutants', highScore: 205, scores: [205, -1, -1]},
                                    {number: 41714, name: 'Muffin Bandits', highScore: -1, scores: [-1, -1, -1]},
                                    {number: 45406, name: 'Venomous Slammers', highScore: -1, scores: [-1, -1, -1]},
                                    {number: 48551, name: 'Sneaky Falcons', highScore: -1, scores: [-1, -1, -1]},
                                    {number: 61655, name: 'Extreme Dragons', highScore: -1, scores: [-1, -1, -1]},
                                    {number: 74638, name: 'Butterfly Racoons', highScore: -1, scores: [-1, -1, -1]},
                                    {number: 90436, name: 'Fire Bandits', highScore: -1, scores: [-1, -1, -1]},
                                ],
                            };
                            cb(info);
                        }
                    });
                });

                it('should request scoreInfo when it is undefined', () => {
                    return webClient.getScoreInfo().then((res: FLLScoreClient.IScoreInfo) => {
                        assert.isDefined(res.scheduleInfo);
                        assert.isDefined(res.teamInfo);
                        expect(res.scheduleInfo.numberOfTeams).to.equal(12);
                        expect(res.teamInfo.length).to.equal(12);
                        expect(res.teamInfo[0].number).to.equal(16449);
                        expect(emitStub).to.have.callCount(1);
                        emitStub.restore();
                    });
                });

                it('should resolve to scoreInfo when it is not undefined', () => {
                    return webClient.getScoreInfo().then((res: FLLScoreClient.IScoreInfo) => {
                        assert.isDefined(res.scheduleInfo);
                        assert.isDefined(res.teamInfo);
                        expect(res.scheduleInfo.numberOfTeams).to.equal(12);
                        expect(res.teamInfo.length).to.equal(12);
                        expect(res.teamInfo[0].number).to.equal(16449);
                        expect(emitStub).to.have.callCount(1);
                        return webClient.getScoreInfo();
                    }).then((res) => {
                        assert.isDefined(res.scheduleInfo);
                        assert.isDefined(res.teamInfo);
                        expect(res.scheduleInfo.numberOfTeams).to.equal(12);
                        expect(res.teamInfo.length).to.equal(12);
                        expect(res.teamInfo[0].number).to.equal(16449);
                        expect(emitStub).to.have.callCount(1);
                        emitStub.restore();
                    });
                });

                it('should reject when an error is sent', () => {
                    emitStub.resetBehavior();
                    emitStub.callsFake((ev, m, cb) => {
                        if (ev === 'sendScoreInfo') {
                            expect(m.toString()).to.equal('please');
                            cb(new Error('scoreInfoError'));
                        }
                    });

                    return webClient.getScoreInfo().catch((err: Error) => {
                        expect(err.message).to.equal('scoreInfoError');
                    });
                });
            });
        });
    }
}
