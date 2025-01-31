import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { NotificationMessageDto } from './dto/notification-message.dto';

@WebSocketGateway({ cors: { origin: '*' } })
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  sendInvoiceUpdate(userId: string, data: NotificationMessageDto) {
    this.server.to(userId).emit('invoice.status.update', data);
  }
}
