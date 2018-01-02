"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FLLScoreClientConstants;
(function (FLLScoreClientConstants) {
    FLLScoreClientConstants.WELCOME = /^Welcome:[0-9]+(\r\n)*$/;
    FLLScoreClientConstants.ECHO = /^Echo:(\r\n)*$/;
    FLLScoreClientConstants.SCORE_HEADER = /^Score Header:[a-zA-Z0-9\/:]+(\|[0-9]+){3}(\r\n)*$/;
    FLLScoreClientConstants.SCORE = /^Score:[0-9]+\|.+(\|(-1|[0-9]+)){4}(\r\n)*$/;
    FLLScoreClientConstants.SCORE_DONE = /^Score Done:(\r\n)*$/;
    FLLScoreClientConstants.LAST_UPDATE = /^Last Update:.+(\r\n)*$/;
})(FLLScoreClientConstants = exports.FLLScoreClientConstants || (exports.FLLScoreClientConstants = {}));
