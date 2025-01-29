import { Module } from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../modules/user/entities/user.entity';
import { Authentication } from '../modules/authentication/entities/authentication.entity';
import { Notification } from '../modules/notification/entities/notification.entity';

@Module({
  imports: [
      SequelizeModule.forFeature([
          User,
          Notification,
          Authentication,
      ])
  ],
  exports: [SequelizeModule],
  providers: [RepositoryService],
})
export class RepositoryModule {}
