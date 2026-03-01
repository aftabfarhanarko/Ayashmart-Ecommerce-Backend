"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const get_app_1 = require("../src/get-app");
async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        res.status(204).end();
        return;
    }
    const app = await (0, get_app_1.getApp)();
    const server = app.getHttpAdapter().getInstance();
    return server(req, res);
}
//# sourceMappingURL=index.js.map