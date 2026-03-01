import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/help-support',
})
export class HelpSupportGateway {
  @WebSocketServer()
  server: Server;

  /**
   * Emit new reply to all clients viewing this ticket.
   * Called from HelpService.addReply.
   */
  emitNewReply(ticketId: number, reply: { message: string; author: string; createdAt: string }) {
    this.server?.to(`ticket:${ticketId}`).emit('help:reply', { ticketId, reply });
  }

  /**
   * Client joins room for a specific ticket to receive real-time replies.
   */
  @SubscribeMessage('help:join')
  handleJoin(
    @MessageBody() data: { ticketId: number },
    @ConnectedSocket() client: any,
  ) {
    if (data?.ticketId) {
      client.join(`ticket:${data.ticketId}`);
    }
  }

  @SubscribeMessage('help:leave')
  handleLeave(
    @MessageBody() data: { ticketId: number },
    @ConnectedSocket() client: any,
  ) {
    if (data?.ticketId) {
      client.leave(`ticket:${data.ticketId}`);
    }
  }
}
