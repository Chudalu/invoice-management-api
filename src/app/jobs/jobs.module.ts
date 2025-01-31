import { Module } from '@nestjs/common';
import { CronService } from './cron/cron.service';
import { UserModule } from '../modules/user/user.module';

@Module({
  providers: [CronService],
  imports: [UserModule]
})
export class JobsModule {}
