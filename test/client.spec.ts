import * as chai from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import { expect } from "chai";
import { Client } from "../src/proxy/client";
import { FLLScoreClient } from "../src/shared/interface";
import * as FLLScoreClientConstants from '../src/constants';
import { Socket } from "net";

chai.use(sinonChai);
chai.use(require("chai-datetime"));

describe('Client', () => {
    describe('constructor', () => {
        it('should construct with no parameters', () => {
            let client = new Client();

            expect(client.host).to.equal('localhost');
            expect(client.port).to.equal(25002);
            expect(client.name).to.equal('FLLScoreClient');
            expect(client.status).to.equal(FLLScoreClientConstants.ConnectionStatus.Disconnected);
            expect(client.lastUpdate).to.be.undefined;
            expect(client.scoreInfo).to.be.undefined;
            expect(client.socket instanceof Socket).to.be.true;
        });

        it('should construct with host', () => {
            let client = new Client({host: 'new-host'});

            expect(client.host).to.equal('new-host');
            expect(client.port).to.equal(25002);
            expect(client.name).to.equal('FLLScoreClient');
            expect(client.status).to.equal(FLLScoreClientConstants.ConnectionStatus.Disconnected);
            expect(client.lastUpdate).to.be.undefined;
            expect(client.scoreInfo).to.be.undefined;
            expect(client.socket instanceof Socket).to.be.true;
        });

        it('should construct with host and port', () => {
            let client = new Client({host: 'new-host', port: 8080});

            expect(client.host).to.equal('new-host');
            expect(client.port).to.equal(8080);
            expect(client.name).to.equal('FLLScoreClient');
            expect(client.status).to.equal(FLLScoreClientConstants.ConnectionStatus.Disconnected);
            expect(client.lastUpdate).to.be.undefined;
            expect(client.scoreInfo).to.be.undefined;
            expect(client.socket instanceof Socket).to.be.true;
        });

        it('should construct with host, port and name', () => {
            let client = new Client({host: 'new-host', port: 8080, name: 'new-name'});

            expect(client.host).to.equal('new-host');
            expect(client.port).to.equal(8080);
            expect(client.name).to.equal('new-name');
            expect(client.status).to.equal(FLLScoreClientConstants.ConnectionStatus.Disconnected);
            expect(client.lastUpdate).to.be.undefined;
            expect(client.scoreInfo).to.be.undefined;
            expect(client.socket instanceof Socket).to.be.true;
        });
    });

    describe('connect', () => {
        let client:Client;
        let connectStub;
        let writeStub;

        beforeEach(() => {
            client = new Client({host: 'localhost', port: 25002, name: 'UnitTest', useWatchdog: false});
        });

        it('should resolve on successful connect', (done) => {

            connectStub = sinon.stub(client.socket, 'connect');
            connectStub.callsFake((options, cb) => {
                expect(options.port).to.equal(25002);
                expect(options.host).to.equal('localhost');
                setTimeout(() => {
                    cb();
                }, 1);
            });

            writeStub = sinon.stub(client.socket, 'write');
            writeStub.callsFake(() => {
                client.socket.emit('data', 'Welcome:5\r\n');
            });

            expect(client.status).to.equal(FLLScoreClientConstants.ConnectionStatus.Disconnected);
            client.connect().then((res) => {
                expect(res).to.equal('Connected');
                expect(client.status).to.equal(FLLScoreClientConstants.ConnectionStatus.Connected);
                expect(connectStub).to.have.been.calledOnce;
                expect(writeStub).to.have.been.calledOnce;
                expect(writeStub).to.have.been.calledWith('FLLScore:UnitTest|Primary\r\n');
                connectStub.restore();
                writeStub.restore();
                done();
            });
            expect(client.status).to.equal(FLLScoreClientConstants.ConnectionStatus.Connecting);
        });

        it('should reject when an connect error occurs', (done) => {
            connectStub = sinon.stub(client.socket, 'connect');
            connectStub.callsFake((options) => {
                expect(options.port).to.equal(25002);
                expect(options.host).to.equal('localhost');
                setTimeout(() => {
                    client.socket.emit('error', new Error('connect error'));
                }, 1);
            });

            writeStub = sinon.stub(client.socket, 'write');
            writeStub.callsFake(() => {
                client.socket.emit('data', 'Welcome:5\r\n');
            });

            expect(client.status).to.equal(FLLScoreClientConstants.ConnectionStatus.Disconnected);
            client.connect().catch((err) => {
                expect(err.message).to.equal('connect error');
                expect(client.status).to.equal(FLLScoreClientConstants.ConnectionStatus.Disconnected);
                expect(connectStub).to.have.been.calledOnce;
                expect(writeStub).not.to.have.been.calledOnce;
                connectStub.restore();
                writeStub.restore();
                done();
            });
            expect(client.status).to.equal(FLLScoreClientConstants.ConnectionStatus.Connecting);
        });

        it('should reject when a wrong welcome message is returned', (done) => {
            connectStub = sinon.stub(client.socket, 'connect');
            connectStub.callsFake((options, cb) => {
                expect(options.port).to.equal(25002);
                expect(options.host).to.equal('localhost');
                setTimeout(() => {
                    cb();
                }, 1);
            });

            writeStub = sinon.stub(client.socket, 'write');
            writeStub.callsFake(() => {
                client.socket.emit('data', 'NotWelcome:5\r\n');
            });

            expect(client.status).to.equal(FLLScoreClientConstants.ConnectionStatus.Disconnected);
            client.connect().catch((err) => {
                expect(err.message).to.equal('Unexpected Message returned: NotWelcome:5\r\n');
                expect(client.status).to.equal(FLLScoreClientConstants.ConnectionStatus.Disconnected);
                expect(connectStub).to.have.been.calledOnce;
                expect(writeStub).to.have.been.calledOnce;
                expect(writeStub).to.have.been.calledWith('FLLScore:UnitTest|Primary\r\n');
                connectStub.restore();
                writeStub.restore();
                done();
            });
            expect(client.status).to.equal(FLLScoreClientConstants.ConnectionStatus.Connecting);
        });
    });

    describe('sendPing', () => {
        let client:Client;
        let connectStub;
        let writeStub;

        beforeEach(() => {
            client = new Client({host: 'localhost', port: 25002, name: 'UnitTest', useWatchdog: false});
        });

        it('should resolve on successful ping', () => {
            connectStub = sinon.stub(client.socket, 'connect');
            connectStub.callsFake((options, cb) => {
                expect(options.port).to.equal(25002);
                expect(options.host).to.equal('localhost');
                cb();
            });

            writeStub = sinon.stub(client.socket, 'write');
            writeStub.callsFake((buffer) => {
                if(buffer === 'FLLScore:UnitTest|Primary\r\n') {
                    client.socket.emit('data', 'Welcome:5\r\n');
                } else if(buffer === 'Ping:\r\n') {
                    client.socket.emit('data', 'Echo:\r\n');
                }
            });

            expect(client.status).to.equal(FLLScoreClientConstants.ConnectionStatus.Disconnected);
            return client.connect().then(() => {
               return client.sendPing();
            }).then((res) => {
                expect(res).to.equal('Echo Received');
                expect(client.status).to.equal(FLLScoreClientConstants.ConnectionStatus.Connected);
                expect(connectStub).to.have.been.calledOnce;
                expect(writeStub).to.have.been.calledTwice;
                expect(writeStub).to.have.been.calledWith('FLLScore:UnitTest|Primary\r\n');
                expect(writeStub).to.have.been.calledWith('Ping:\r\n');
                connectStub.restore();
                writeStub.restore();
            });
        });

        it('should reject if client is not connected', () => {
            return client.sendPing().catch((err) => {
                expect(err.message).to.equal('Not Connected');
                expect(client.status).to.equal(FLLScoreClientConstants.ConnectionStatus.Disconnected);
            });
        });

        it('should reject when a send error occurs', () => {
            connectStub = sinon.stub(client.socket, 'connect');
            connectStub.callsFake((options, cb) => {
                expect(options.port).to.equal(25002);
                expect(options.host).to.equal('localhost');
                cb();
            });

            writeStub = sinon.stub(client.socket, 'write');
            writeStub.callsFake((buffer) => {
                if(buffer === 'FLLScore:UnitTest|Primary\r\n') {
                    client.socket.emit('data', 'Welcome:5\r\n');
                } else if(buffer === 'Ping:\r\n') {
                    client.socket.emit('error', new Error('send error'));
                    client.socket.emit('close', false);
                }
            });

            expect(client.status).to.equal(FLLScoreClientConstants.ConnectionStatus.Disconnected);
            return client.connect().then(() => {
                return client.sendPing();
            }).catch((err) => {
                expect(err.message).to.equal('send error');
                expect(client.status).to.equal(FLLScoreClientConstants.ConnectionStatus.Disconnected);
                expect(connectStub).to.have.been.calledOnce;
                expect(writeStub).to.have.been.calledTwice;
                expect(writeStub).to.have.been.calledWith('FLLScore:UnitTest|Primary\r\n');
                expect(writeStub).to.have.been.calledWith('Ping:\r\n');
                connectStub.restore();
                writeStub.restore();
            });
        });

        it('should reject when a wrong echo message is returned', () => {
            connectStub = sinon.stub(client.socket, 'connect');
            connectStub.callsFake((options, cb) => {
                expect(options.port).to.equal(25002);
                expect(options.host).to.equal('localhost');
                cb();
            });

            writeStub = sinon.stub(client.socket, 'write');
            writeStub.callsFake((buffer:string) => {
                if(buffer === 'FLLScore:UnitTest|Primary\r\n') {
                    client.socket.emit('data', 'Welcome:5\r\n');
                } else if(buffer === 'Ping:\r\n') {
                    client.socket.emit('data', 'NotEcho:\r\n');
                }
            });

            expect(client.status).to.equal(FLLScoreClientConstants.ConnectionStatus.Disconnected);
            return client.connect().then(() => {
                return client.sendPing();
            }).catch((err) => {
                expect(err.message).to.equal('Unexpected Message returned: NotEcho:\r\n');
                expect(client.status).to.equal(FLLScoreClientConstants.ConnectionStatus.Connected);
                expect(connectStub).to.have.been.calledOnce;
                expect(writeStub).to.have.been.calledTwice;
                expect(writeStub).to.have.been.calledWith('FLLScore:UnitTest|Primary\r\n');
                expect(writeStub).to.have.been.calledWith('Ping:\r\n');
                connectStub.restore();
                writeStub.restore();
            });
        });
    });

    describe('sendLastUpdate', () => {
        let client:Client;
        let connectStub;
        let writeStub;

        beforeEach(() => {
            client = new Client({host: 'localhost', port: 25002, name: 'UnitTest', useWatchdog: false});
            connectStub = sinon.stub(client.socket, 'connect');
            connectStub.callsFake((options, cb) => {
                expect(options.port).to.equal(25002);
                expect(options.host).to.equal('localhost');
                cb();
            });
        });

        afterEach(() => {
            connectStub.restore();
        });

        it('should resolve on a successful last update', () => {
            writeStub = sinon.stub(client.socket, 'write');
            writeStub.callsFake((buffer) => {
                if(buffer === 'FLLScore:UnitTest|Primary\r\n') {
                    client.socket.emit('data', 'Welcome:5\r\n');
                } else if(buffer === 'Send Last Update:\r\n') {
                    client.socket.emit('data', 'Last Update:11/10/2017 7:52:40 AM\r\n');
                }
            });

            return client.connect().then(() => {
                return client.sendLastUpdate();
            }).then((res) => {
                let date = new Date('11/10/2017 7:52:40 AM');
                expect(res).to.equalDate(date);
                expect(client.lastUpdate).to.equalDate(date);
                expect(client.status).to.equal(FLLScoreClientConstants.ConnectionStatus.Connected);
                expect(connectStub).to.have.been.calledOnce;
                expect(writeStub).to.have.been.calledTwice;
                expect(writeStub).to.have.been.calledWith('FLLScore:UnitTest|Primary\r\n');
                expect(writeStub).to.have.been.calledWith('Send Last Update:\r\n');
                writeStub.restore();
            });
        });

        it('should reject if client is not connected', () => {
            return client.sendLastUpdate().catch((err) => {
                expect(err.message).to.equal('Not Connected');
                expect(client.status).to.equal(FLLScoreClientConstants.ConnectionStatus.Disconnected);
            });
        });

        it('should reject when a send error occurs', () => {
            writeStub = sinon.stub(client.socket, 'write');
            writeStub.callsFake((buffer:string) => {
                if(buffer === 'FLLScore:UnitTest|Primary\r\n') {
                    client.socket.emit('data', 'Welcome:5\r\n');
                } else if(buffer === 'Send Last Update:\r\n') {
                    client.socket.emit('error', new Error('send error'));
                    client.socket.emit('close', false);
                }
            });

            return client.connect().then(() => {
                return client.sendLastUpdate();
            }).catch((err) => {
                expect(err.message).to.equal('send error');
                expect(client.status).to.equal(FLLScoreClientConstants.ConnectionStatus.Disconnected);
                expect(connectStub).to.have.been.calledOnce;
                expect(writeStub).to.have.been.calledTwice;
                expect(writeStub).to.have.been.calledWith('FLLScore:UnitTest|Primary\r\n');
                expect(writeStub).to.have.been.calledWith('Send Last Update:\r\n');
                writeStub.restore();
            });
        });

        it('should reject when a wrong last update message is sent', () => {
            writeStub = sinon.stub(client.socket, 'write');
            writeStub.callsFake((buffer:string) => {
                if(buffer === 'FLLScore:UnitTest|Primary\r\n') {
                    client.socket.emit('data', 'Welcome:5\r\n');
                } else if(buffer === 'Send Last Update:\r\n') {
                    client.socket.emit('data', 'NotLastUpdate:\r\n');
                }
            });

            return client.connect().then(() => {
                return client.sendLastUpdate();
            }).catch((err) => {
                expect(err.message).to.equal('Unexpected Message returned: NotLastUpdate:\r\n');
                expect(client.status).to.equal(FLLScoreClientConstants.ConnectionStatus.Connected);
                expect(connectStub).to.have.been.calledOnce;
                expect(writeStub).to.have.been.calledTwice;
                expect(writeStub).to.have.been.calledWith('FLLScore:UnitTest|Primary\r\n');
                expect(writeStub).to.have.been.calledWith('Send Last Update:\r\n');
                writeStub.restore();
            });
        });
    });

    describe('sendScore', () => {
        let client:Client;
        let connectStub;
        let writeStub;

        beforeEach(() => {
            client = new Client({host: 'localhost', port: 25002, name: 'UnitTest', useWatchdog: false});
            connectStub = sinon.stub(client.socket, 'connect');
            connectStub.callsFake((options, cb) => {
                expect(options.port).to.equal(25002);
                expect(options.host).to.equal('localhost');
                cb();
            });
        });

        afterEach(() => {
            connectStub.restore();
        });

        it('should resolve on a successful send score', () => {
            writeStub = sinon.stub(client.socket, 'write');
            writeStub.callsFake((buffer) => {
                if(buffer === 'FLLScore:UnitTest|Primary\r\n') {
                    client.socket.emit('data', 'Welcome:5\r\n');
                } else if(buffer === 'Send Score:\r\n') {
                    let responses = [
                        'Score Header:11/10/2017 7:52:40 AM|12|36|6\r\n',
                        'Score:16449|Dolphin Spiders|310|310|-1|-1\r\n',
                        'Score:17557|Crimson Flying|145|145|-1|-1\r\n',
                        'Score:23402|Striking Heroes|270|270|-1|-1\r\n',
                        'Score:30150|Lightning Spanners|275|275|-1|245\r\n',
                        'Score:33256|Alpha Secret Agents|-1|-1|-1|-1\r\n',
                        'Score:36131|Ice Mutants|205|205|-1|-1\r\n',
                        'Score:41714|Muffin Bandits|-1|-1|-1|-1\r\n',
                        'Score:45406|Venomous Slammers|-1|-1|-1|-1\r\n',
                        'Score:48551|Sneaky Falcons|-1|-1|-1|-1\r\n',
                        'Score:61655|Extreme Dragons|-1|-1|-1|-1\r\n',
                        'Score:74638|Butterfly Racoons|-1|-1|-1|-1\r\n',
                        'Score:90436|Fire Bandits|-1|-1|-1|-1\r\n',
                        'Score Done:\r\n'
                    ];
                    client.socket.emit('data', responses.join(''));
                }
            });

            return client.connect().then(() => {
                return client.sendScore();
            }).then((res:FLLScoreClient.IScoreInfo) => {
                expect(res.scheduleInfo).not.to.be.undefined;
                expect(res.teamInfo).not.to.be.undefined;
                expect(res.teamInfo.length).to.equal(12);
                expect(client.status).to.equal(FLLScoreClientConstants.ConnectionStatus.Connected);
                expect(connectStub).to.have.been.calledOnce;
                expect(writeStub).to.have.been.calledTwice;
                expect(writeStub).to.have.been.calledWith('FLLScore:UnitTest|Primary\r\n');
                expect(writeStub).to.have.been.calledWith('Send Score:\r\n');
                writeStub.restore();
            });
        });

        it('should resolve when data is sent in parts', () => {
            writeStub = sinon.stub(client.socket, 'write');
            writeStub.callsFake((buffer) => {
                if(buffer === 'FLLScore:UnitTest|Primary\r\n') {
                    client.socket.emit('data', 'Welcome:5\r\n');
                } else if(buffer === 'Send Score:\r\n') {
                    let responses1 = [
                        'Score Header:11/10/2017 7:52:40 AM|12|36|6\r\n',
                        'Score:16449|Dolphin Spiders|310|310|-1|-1\r\n',
                        'Score:17557|Crimson Flying|145|145|-1|-1\r\n',
                        'Score:23402|Striking Heroes|270|270|-1|-1\r\n',
                        'Score:30150|Lightning Spanners|275|275|-1|245\r\n',
                        'Score:33256|Alpha Secret Agents|-1|-1|-1|-1\r\n',
                        'Score:36131|Ice Mutants|'
                    ];
                    let responses2 = [
                        '205|205|-1|-1\r\n',
                        'Score:41714|Muffin Bandits|-1|-1|-1|-1\r\n',
                        'Score:45406|Venomous Slammers|-1|-1|-1|-1\r\n',
                        'Score:48551|Sneaky Falcons|-1|-1|-1|-1\r\n',
                        'Score:61655|Extreme Dragons|-1|-1|-1|-1\r\n',
                        'Score:74638|Butterfly Racoons|-1|-1|-1|-1\r\n',
                        'Score:90436|Fire Bandits|-1|-1|-1|-1\r\n',
                        'Score Done:\r\n'
                    ];
                    client.socket.emit('data', responses1.join(''));
                    client.socket.emit('data', responses2.join(''));
                }
            });

            return client.connect().then(() => {
                return client.sendScore();
            }).then((res:FLLScoreClient.IScoreInfo) => {
                expect(res.scheduleInfo).not.to.be.undefined;
                expect(res.teamInfo).not.to.be.undefined;
                expect(res.teamInfo.length).to.equal(12);
                expect(client.status).to.equal(FLLScoreClientConstants.ConnectionStatus.Connected);
                expect(connectStub).to.have.been.calledOnce;
                expect(writeStub).to.have.been.calledTwice;
                expect(writeStub).to.have.been.calledWith('FLLScore:UnitTest|Primary\r\n');
                expect(writeStub).to.have.been.calledWith('Send Score:\r\n');
                writeStub.restore();
            });
        });

        it('should reject if client is not connected', () => {
            return client.sendScore().catch((err) => {
                expect(err.message).to.equal('Not Connected');
                expect(client.status).to.equal(FLLScoreClientConstants.ConnectionStatus.Disconnected);
            });
        });

        it('should reject when a send error occurs', () => {
            writeStub = sinon.stub(client.socket, 'write');
            writeStub.callsFake((buffer) => {
                if(buffer === 'FLLScore:UnitTest|Primary\r\n') {
                    client.socket.emit('data', 'Welcome:5\r\n');
                } else if(buffer === 'Send Score:\r\n') {
                    client.socket.emit('error', new Error('send error'));
                    client.socket.emit('close', false);
                }
            });

            return client.connect().then(() => {
                return client.sendScore();
            }).catch((err) => {
                expect(err.message).to.equal('send error');
                expect(client.status).to.equal(FLLScoreClientConstants.ConnectionStatus.Disconnected);
                expect(connectStub).to.have.been.calledOnce;
                expect(writeStub).to.have.been.calledTwice;
                expect(writeStub).to.have.been.calledWith('FLLScore:UnitTest|Primary\r\n');
                expect(writeStub).to.have.been.calledWith('Send Score:\r\n');
                writeStub.restore();
            });
        });
    });

    describe('close', () => {
        let client:Client;
        let connectStub;
        let endStub;
        let writeStub;

        beforeEach(() => {
            client = new Client({host: 'localhost', port: 25002, name: 'UnitTest', useWatchdog: false});
            connectStub = sinon.stub(client.socket, 'connect');
            connectStub.callsFake((options, cb) => {
                expect(options.port).to.equal(25002);
                expect(options.host).to.equal('localhost');
                cb();
            });

            writeStub = sinon.stub(client.socket, 'write');
            writeStub.callsFake((buffer) => {
                if(buffer === 'FLLScore:UnitTest|Primary\r\n') {
                    client.socket.emit('data', 'Welcome:5\r\n');
                }
            });
        });

        afterEach(() => {
            connectStub.restore();
            writeStub.restore();
        });

        it('should resolve on successful close', () => {
            endStub = sinon.stub(client.socket, 'end');
            endStub.callsFake(() => {
                client.socket.emit('close', false);
            });

            expect(client.status).to.equal(FLLScoreClientConstants.ConnectionStatus.Disconnected);
            return client.connect().then(() => {
                expect(client.status).to.equal(FLLScoreClientConstants.ConnectionStatus.Connected);
                return client.close();
            }).then((res) => {
                expect(client.status).to.equal(FLLScoreClientConstants.ConnectionStatus.Disconnected);
                expect(res).to.equal('Connection Closed');
                expect(connectStub).to.have.been.calledOnce;
                expect(writeStub).to.have.been.calledOnce;
                expect(endStub).to.have.been.calledOnce;
                endStub.restore();
            });
        });

        it('should reject if client is not connected', () => {
            return client.close().catch((err) => {
                expect(err.message).to.equal('Not Connected');
                expect(client.status).to.equal(FLLScoreClientConstants.ConnectionStatus.Disconnected);
            });
        });

        it('should reject on a close error', () => {
            endStub = sinon.stub(client.socket, 'end');
            endStub.callsFake(() => {
                client.socket.emit('close', true);
            });

            expect(client.status).to.equal(FLLScoreClientConstants.ConnectionStatus.Disconnected);
            return client.connect().then(() => {
                expect(client.status).to.equal(FLLScoreClientConstants.ConnectionStatus.Connected);
                return client.close();
            }).catch((res) => {
                expect(client.status).to.equal(FLLScoreClientConstants.ConnectionStatus.Disconnected);
                expect(res.message).to.equal('Closed with error');
                expect(connectStub).to.have.been.calledOnce;
                expect(writeStub).to.have.been.calledOnce;
                expect(endStub).to.have.been.calledOnce;
                endStub.restore();
            });
        });

        it('should reject on an end error', () => {
            endStub = sinon.stub(client.socket, 'end');
            endStub.callsFake(() => {
                client.socket.emit('error', new Error('close error'));
                client.socket.emit('close', false);
            });

            expect(client.status).to.equal(FLLScoreClientConstants.ConnectionStatus.Disconnected);
            return client.connect().then(() => {
                expect(client.status).to.equal(FLLScoreClientConstants.ConnectionStatus.Connected);
                return client.close();
            }).catch((res) => {
                expect(client.status).to.equal(FLLScoreClientConstants.ConnectionStatus.Disconnected);
                expect(res.message).to.equal('close error');
                expect(connectStub).to.have.been.calledOnce;
                expect(writeStub).to.have.been.calledOnce;
                expect(endStub).to.have.been.calledOnce;
                endStub.restore();
            });
        });
    });

    describe('watchdog timer', () => {
        let client:Client;
        let connectStub;
        let endStub;
        let writeStub;
        let setIntervalSpy;
        let clearIntervalSpy;

        beforeEach(() => {

            this.clock = sinon.useFakeTimers();

            setIntervalSpy = sinon.spy(this.clock, 'setInterval');
            clearIntervalSpy = sinon.spy(this.clock, 'clearInterval');

            client = new Client({host: 'localhost', port: 25002, name: 'UnitTest'});
            connectStub = sinon.stub(client.socket, 'connect');
            connectStub.callsFake((options, cb) => {
                expect(options.port).to.equal(25002);
                expect(options.host).to.equal('localhost');
                cb();
            });

            writeStub = sinon.stub(client.socket, 'write');
            writeStub.withArgs('FLLScore:UnitTest|Primary\r\n').callsFake(() => {
                client.socket.emit('data', 'Welcome:5\r\n');
            });
            writeStub.callsFake((buffer, cb) => {
               if(buffer === 'Ping:\r\n') {
                   client.socket.emit('data', 'Echo:\r\n');
                   if(cb !== undefined) {
                       cb();
                   }
               }
            });

            endStub = sinon.stub(client.socket, 'end');
            endStub.callsFake(() => {
                client.socket.emit('close', false);
            });
        });

        afterEach(() => {
            connectStub.restore();
            writeStub.restore();
            endStub.restore();
            setIntervalSpy.restore();
            clearIntervalSpy.restore();
            this.clock.restore();
        });

        it('should cancel timer when closing connection', () => {
            return client.connect().then(() => {
                expect(setIntervalSpy).to.have.been.calledOnce;
                return client.close();
            }).then(() => {
                expect(clearIntervalSpy).to.have.been.calledOnce;
            });
        });

        it('should call ping when no calls have been made', () => {
            return client.connect().then(() => {
                expect(setIntervalSpy).to.have.been.calledOnce;
                this.clock.tick(5100);
                expect(writeStub).to.have.been.calledTwice;
                this.clock.tick(5100);
                expect(writeStub).to.have.been.calledThrice;
                return client.close();
            });
        });

        it('should reset timer when a call has been made', () => {
            return client.connect().then(() => {
                expect(setIntervalSpy).to.have.been.calledOnce;
                this.clock.tick(5100);
                expect(writeStub).to.have.been.calledTwice;
                this.clock.tick(3000);
                expect(clearIntervalSpy).not.to.have.been.called;
                expect(setIntervalSpy).to.have.been.calledOnce;
                return client.sendPing();
            }).then(() => {
                this.clock.tick(2000);
                expect(clearIntervalSpy).to.have.been.calledOnce;
                expect(setIntervalSpy).to.have.been.calledTwice;
                expect(writeStub).to.have.been.calledThrice;
                return client.close();
            });
        });
    });
});
