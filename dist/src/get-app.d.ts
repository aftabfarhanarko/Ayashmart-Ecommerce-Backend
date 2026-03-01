import { NestExpressApplication } from '@nestjs/platform-express';
export declare function getApp(): Promise<NestExpressApplication<import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>>>;
