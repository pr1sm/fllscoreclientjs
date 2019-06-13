import { expect } from 'chai';
import * as FLLScoreClientConstants from '../../../src/constants/index';

export class ConstantsSpec {
    public static run() {
        describe('FLLScoreClientConstants', () => {
            describe('Welcome Regex', () => {
                const regex = FLLScoreClientConstants.WELCOME;

                it('should succeed on a welcome command', () => {
                    expect(regex.test('Welcome:5\r\n')).to.equal(true);
                });

                it('should succeed on a welcome command without \\r\\n', () => {
                    expect(regex.test('Welcome:5')).to.equal(true);
                });

                it('should fail on wrong capitalization', () => {
                    expect(regex.test('WeLCOmE:5')).to.equal(false);
                });

                it('should fail when there are proceeding characters', () => {
                    expect(regex.test('ExtraWelcome:')).to.equal(false);
                });

                it('should fail when there are succeeding characters', () => {
                    expect(regex.test('Welcome:5Extra')).to.equal(false);
                });

                it('should fail on no watchdog interval', () => {
                    expect(regex.test('Welcome:')).to.equal(false);
                });
            });

            describe('Echo Regex', () => {
                const regex = FLLScoreClientConstants.ECHO;

                it('should succeed on an echo command', () => {
                    expect(regex.test('Echo:\r\n')).to.equal(true);
                });

                it('should succeed on an echo command without \\r\\n', () => {
                    expect(regex.test('Echo:')).to.equal(true);
                });

                it('should fail on wrong capitalization', () => {
                    expect(regex.test('ECho:')).to.equal(false);
                });

                it('should fail when there are proceeding characters', () => {
                    expect(regex.test('ExtraEcho:')).to.equal(false);
                });

                it('should fail when there are succeeding characters', () => {
                    expect(regex.test('Echo:Extra')).to.equal(false);
                });
            });

            describe('Score Header Regex', () => {
                const regex = FLLScoreClientConstants.SCORE_HEADER;

                it('should succeed on a score header command', () => {
                    expect(regex.test('Score Header:11/10/2017 7:52:40 AM|12|36|6\r\n')).to.equal(true);
                });

                it('should succeed on a score header command without \\r\\n', () => {
                    expect(regex.test('Score Header:11/10/2017 7:52:40 AM|12|36|6')).to.equal(true);
                });

                it('should fail on wrong capitalization', () => {
                    expect(regex.test('ScORe HEAder:11/10/2017 7:52:40 AM|12|36|6')).to.equal(false);
                });

                it('should fail when there are proceeding characters', () => {
                    expect(regex.test('ExtraScore Header:11/10/2017 7:52:40 AM|12|36|6')).to.equal(false);
                });

                it('should fail when there are succeeding characters', () => {
                    expect(regex.test('Score Header:11/10/2017 7:52:40 AM|12|36|6Extra')).to.equal(false);
                });

                it('should fail on no date', () => {
                    expect(regex.test('Score Header:|12|36|6')).to.equal(false);
                });

                it('should fail on no number of teams', () => {
                    expect(regex.test('Score Header:11/10/2017 7:52:40 AM||36|6')).to.equal(false);
                });

                it('should fail on no total matches', () => {
                    expect(regex.test('Score Header:11/10/2017 7:52:40 AM|12||6')).to.equal(false);
                });

                it('should fail on no current match', () => {
                    expect(regex.test('Score Header:11/10/2017 7:52:40 AM|12|36|')).to.equal(false);
                });
            });

            describe('Score Regex', () => {
                const regex = FLLScoreClientConstants.SCORE;

                it('should succeed on a score command', () => {
                    expect(regex.test('Score:40503|Team Unit Testing|42|42|-1|-1\r\n')).to.equal(true);
                });

                it('should succeed on a score command without \\r\\n', () => {
                    expect(regex.test('Score:40503|Team Unit Testing|42|42|-1|-1')).to.equal(true);
                });

                it('should succeed on a score command with 1 match played', () => {
                    expect(regex.test('Score:40503|Team Unit Testing|42|42|-1|-1\r\n')).to.equal(true);
                });

                it('should succeed on a score command with 2 matches played', () => {
                    expect(regex.test('Score:40503|Team Unit Testing|42|42|25|-1\r\n')).to.equal(true);
                });

                it('should succeed on a score command with 3 matches played', () => {
                    expect(regex.test('Score:40503|Team Unit Testing|42|42|25|34\r\n')).to.equal(true);
                });

                it('should fail on wrong capitalization', () => {
                    expect(regex.test('ScORe:40503|Team Unit Testing|42|42|-1|-1')).to.equal(false);
                });

                it('should fail when there are proceeding characters', () => {
                    expect(regex.test('ExtraScore:40503|Team Unit Testing|42|42|-1|-1')).to.equal(false);
                });

                it('should fail when there are succeeding characters', () => {
                    expect(regex.test('Score:40503|Team Unit Testing|42|42|-1|-1Extra')).to.equal(false);
                });

                it('should fail on no team number', () => {
                    expect(regex.test('Score:|Team Unit Testing|42|42|-1|-1')).to.equal(false);
                });

                it('should fail on no team name', () => {
                    expect(regex.test('Score:40503||42|42|-1|-1')).to.equal(false);
                });

                it('should fail on no highest score', () => {
                    expect(regex.test('Score:40503|Team Unit Testing||42|42|42')).to.equal(false);
                });

                it('should fail on no match 1', () => {
                    expect(regex.test('Score:40503|Team Unit Testing|42||42|42')).to.equal(false);
                });

                it('should fail on no match 2', () => {
                    expect(regex.test('Score:40503|Team Unit Testing|42|42||42')).to.equal(false);
                });

                it('should fail on no match 3', () => {
                    expect(regex.test('Score:40503|Team Unit Testing|42|42|42|')).to.equal(false);
                });
            });

            describe('Score Done Regex', () => {
                const regex = FLLScoreClientConstants.SCORE_DONE;

                it('should succeed on a Score Done command', () => {
                    expect(regex.test('Score Done:\r\n')).to.equal(true);
                });

                it('should succeed on a Score Done command without \\r\\n', () => {
                    expect(regex.test('Score Done:')).to.equal(true);
                });

                it('should fail on wrong capitalization', () => {
                    expect(regex.test('ScORe DONe:')).to.equal(false);
                });

                it('should fail when there are proceeding characters', () => {
                    expect(regex.test('ExtraScore Done:')).to.equal(false);
                });

                it('should fail when there are succeeding characters', () => {
                    expect(regex.test('Score Done:Extra')).to.equal(false);
                });
            });

            describe('Last Update Regex', () => {
                const regex = FLLScoreClientConstants.LAST_UPDATE;

                it('should succeed on a Last Update command', () => {
                    expect(regex.test('Last Update:11/10/2017 7:52:40 AM\r\n')).to.equal(true);
                });

                it('should succeed on a Last Update command without \\r\\n', () => {
                    expect(regex.test('Last Update:11/10/2017 7:52:40 AM')).to.equal(true);
                });

                it('should fail on wrong capitalization', () => {
                    expect(regex.test('LaST UPDaTe:11/10/2017 7:52:40 AM')).to.equal(false);
                });

                it('should fail when there are proceeding characters', () => {
                    expect(regex.test('ExtraLast Update:11/10/2017 7:52:40 AM')).to.equal(false);
                });
            });
        });
    }
}
