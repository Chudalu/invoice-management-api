import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { NotificationMessageDto } from './dto/notification-message.dto';

@WebSocketGateway({ cors: { origin: '*' } })
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  sendInvoiceUpdate(data: NotificationMessageDto) {
    this.server.emit('invoice.status.update', data);
  }
}
