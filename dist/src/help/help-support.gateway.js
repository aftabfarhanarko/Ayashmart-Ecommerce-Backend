"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpSupportGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let HelpSupportGateway = class HelpSupportGateway {
    emitNewReply(ticketId, reply) {
        this.server?.to(`ticket:${ticketId}`).emit('help:reply', { ticketId, reply });
    }
    handleJoin(data, client) {
        if (data?.ticketId) {
            client.join(`ticket:${data.ticketId}`);
        }
    }
    handleLeave(data, client) {
        if (data?.ticketId) {
            client.leave(`ticket:${data.ticketId}`);
        }
    }
};
exports.HelpSupportGateway = HelpSupportGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], HelpSupportGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('help:join'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], HelpSupportGateway.prototype, "handleJoin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('help:leave'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], HelpSupportGateway.prototype, "handleLeave", null);
exports.HelpSupportGateway = HelpSupportGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: '*' },
        namespace: '/help-support',
    })
], HelpSupportGateway);
//# sourceMappingURL=help-support.gateway.js.map