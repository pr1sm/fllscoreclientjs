import {FLLScoreClient} from '../../src/shared/interface';
import {Socket} from "net";
import * as sinon from "sinon";

export class MockClient implements FLLScoreClient.IClient {
    public readonly lastUpdate: Date;
    public readonly opts: FLLScoreClient.IClientOpts = {
        host: 'localhost',
        name: 'FLLScoreClient',
        port: 25002,
        useWatchdog: true,
    };
    public readonly scoreInfo: FLLScoreClient.IScoreInfo = {
        scheduleInfo: {
            lastUpdate: new Date('11/10/2017 7:52:40 AM'),
            numberOfTeams: 4,
            numberOfMatches: 12,
            numberOfCompletedMatches: 1,
        },
        teamInfo: [
            {number: 16449, highScore: 310, name: 'Dolphin Spiders', scores: [310, -1, -1]},
            {number: 17557, highScore: 145, name: 'Crimson Flying', scores: [145, -1, -1]},
            {number: 23402, highScore: -1, name: 'Striking Heroes', scores: [-1, -1, -1]},
            {number: 30150, highScore: -1, name: 'Lightning Spanners', scores: [-1, -1, -1]},
        ],
    };
    public readonly status: number = 0;
    public readonly socket: Socket;

    private rejectConnect: boolean = false;
    private rejectPing: boolean = false;
    private rejectLastUpdate: boolean = false;
    private resolveLastUpdateFalse: boolean = false;
    private rejectSendScore: boolean = false;
    private rejectClose: boolean = false;

    constructor(mockOpts) {
        this.rejectConnect = mockOpts.rejectConnect || this.rejectConnect;
        this.rejectPing = mockOpts.rejectPing || this.rejectPing;
        this.rejectLastUpdate = mockOpts.rejectLastUpdate || this.rejectLastUpdate;
        this.resolveLastUpdateFalse = mockOpts.resolveLastUpdateFalse || this.resolveLastUpdateFalse;
        this.rejectSendScore = mockOpts.rejectSendScore || this.rejectSendScore;
        this.rejectClose = mockOpts.rejectClose || this.rejectClose;

        this.status = mockOpts.defStatus || this.status;
        this.opts = mockOpts.defOpts || this.opts;
        this.lastUpdate = mockOpts.defLastUpdate || this.lastUpdate;
        this.scoreInfo = mockOpts.defScoreInfo || this.scoreInfo;
        this.socket = mockOpts.socket || MockClient.createMockSocket();
    }

    public static createMockSocket() {
        let mock = new Socket();
        sinon.stub(mock, 'on');
        sinon.stub(mock, 'emit');
        sinon.stub(mock, 'removeListener');
        sinon.stub(mock, 'connect');

        return mock;
    }

    public connect(): Promise<string> {
        if (this.rejectConnect) {
            return Promise.reject('error');
        } else {
            return Promise.resolve('connected');
        }
    }

    public sendPing(): Promise<string> {
        if (this.rejectPing) {
            return Promise.reject('error');
        } else {
            return Promise.resolve('echo');
        }
    }

    public sendLastUpdate(): Promise<boolean> {
        if(this.rejectLastUpdate) {
            return Promise.reject('error');
        } else {
            return Promise.resolve(!this.resolveLastUpdateFalse);
        }
    }

    public sendScore(): Promise<FLLScoreClient.IScoreInfo> {
        if(this.rejectSendScore) {
            return Promise.reject('error');
        } else {
            return Promise.resolve(this.scoreInfo);
        }
    }

    public close(): Promise<string> {
        if (this.rejectClose) {
            return Promise.reject('error');
        } else {
            return Promise.resolve('closed');
        }
    }
}
