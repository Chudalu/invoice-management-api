import { Module } from '@nestjs/common';
import { CronService } from './cron/cron.service';
import { AuthenticationModule } from '../modules/authentication/authentication.module';
import { UserModule } from '../modules/user/user.module';

@Module({
  providers: [CronService],
  imports: [
    UserModule,
    AuthenticationModule
  ]
})
export class JobsModule {}
