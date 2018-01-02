"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FLLScoreClient;
(function (FLLScoreClient) {
    let ConnectionStatus;
    (function (ConnectionStatus) {
        ConnectionStatus[ConnectionStatus["Disconnected"] = 0] = "Disconnected";
        ConnectionStatus[ConnectionStatus["Connecting"] = 1] = "Connecting";
        ConnectionStatus[ConnectionStatus["Connected"] = 2] = "Connected";
    })(ConnectionStatus = FLLScoreClient.ConnectionStatus || (FLLScoreClient.ConnectionStatus = {}));
})(FLLScoreClient = exports.FLLScoreClient || (exports.FLLScoreClient = {}));
//# sourceMappingURL=interface.js.map