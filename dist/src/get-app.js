"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApp = getApp;
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
let cachedApp;
async function getApp() {
    if (!cachedApp) {
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        app.enableCors({
            origin: true,
            credentials: false,
        });
        await app.init();
        cachedApp = app;
    }
    return cachedApp;
}
//# sourceMappingURL=get-app.js.map