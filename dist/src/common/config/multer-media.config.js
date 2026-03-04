"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaMulterConfig = void 0;
const multer_1 = require("multer");
exports.mediaMulterConfig = {
    storage: (0, multer_1.memoryStorage)(),
    limits: { fileSize: 20 * 1024 * 1024 },
};
//# sourceMappingURL=multer-media.config.js.map