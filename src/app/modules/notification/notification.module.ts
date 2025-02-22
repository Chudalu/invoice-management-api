import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { RepositoryModule } from 'src/app/repository/repository.module';
import { NotificationGateway } from './notification.gateway';

@Module({
  controllers: [NotificationController],
  providers: [
    NotificationService, 
    NotificationGateway,
  ],
  imports: [RepositoryModule],
  exports: [NotificationService]
})
export class NotificationModule {}
