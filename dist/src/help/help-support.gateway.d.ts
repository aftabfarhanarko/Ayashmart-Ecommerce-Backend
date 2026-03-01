import { Server } from 'socket.io';
export declare class HelpSupportGateway {
    server: Server;
    emitNewReply(ticketId: number, reply: {
        message: string;
        author: string;
        createdAt: string;
    }): void;
    handleJoin(data: {
        ticketId: number;
    }, client: any): void;
    handleLeave(data: {
        ticketId: number;
    }, client: any): void;
}
