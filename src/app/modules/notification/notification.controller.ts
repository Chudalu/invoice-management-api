import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { NotificationGateway } from './notification.gateway';
import { NotificationMessageDto } from './dto/notification-message.dto';

@Controller()
export class NotificationController {
  constructor(private readonly notificationGateway: NotificationGateway) {}

  @EventPattern('invoice.status.updated')
  async handleInvoiceUpdate(data: NotificationMessageDto) {
    console.log('received rabbitMQ notification ==========', data);
    this.notificationGateway.sendInvoiceUpdate(String(data.userId), data);
  }
}
