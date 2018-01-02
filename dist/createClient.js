"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clientImpl_1 = require("./clientImpl");
function createClient(host, port, name) {
    return new clientImpl_1.ClientImpl(host, port, name);
}
exports.createClient = createClient;
//# sourceMappingURL=createClient.js.map