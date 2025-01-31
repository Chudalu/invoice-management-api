import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { ClientProxy, ClientProxyFactory, RmqOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { RABBITMQ_URL } from 'src/app/repository/constants/env-variables.constants';
import { InvoiceDto } from '../invoice/dto/invoice.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Notification } from './entities/notification.entity';
import { NotificationMessageDto } from './dto/notification-message.dto';

@Injectable()
export class NotificationService {

  private client: ClientProxy;

  constructor(
    private configService: ConfigService,
    @InjectModel(Notification) private NotificationRepository: typeof Notification,
    ) {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [configService.getOrThrow(RABBITMQ_URL)],
        queue: 'notifications',
        queueOptions: { durable: false },
      },
    } as RmqOptions);
  }

  async notifyInvoiceStatus(invoice: InvoiceDto) {
    let message: NotificationMessageDto = { 
      userId: invoice.userId,
      invoiceStatus: invoice.invoiceStatus,
      amount: invoice.amount,
      title: invoice.title,
    };
    this.client.emit('invoice.status.updated', message);
    this.createNotification({
      userId: invoice.userId,
      message: JSON.stringify(message)
    });
  }


  private async createNotification(createNotificationDto: CreateNotificationDto) {
    let notification = await this.NotificationRepository.create(createNotificationDto);
    return notification;
  }

}
