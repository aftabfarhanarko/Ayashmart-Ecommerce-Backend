"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaMulterConfig = void 0;
const multer_1 = require("multer");
const path_1 = require("path");
const fs = require("fs");
const uploadsDir = 'uploads/media';
exports.mediaMulterConfig = {
    storage: (0, multer_1.diskStorage)({
        destination: (req, file, cb) => {
            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
            }
            cb(null, uploadsDir);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            const ext = (0, path_1.extname)(file.originalname) || '.jpg';
            cb(null, `img_${uniqueSuffix}${ext}`);
        },
    }),
    limits: { fileSize: 20 * 1024 * 1024 },
};
//# sourceMappingURL=multer-media.config.js.map