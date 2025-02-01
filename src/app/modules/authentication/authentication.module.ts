import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { UserModule } from '../user/user.module';
import { RepositoryModule } from 'src/app/repository/repository.module';
import { ConfigModule } from '@nestjs/config';
import { AppConfig } from 'src/app.config';

@Module({
  imports: [
    UserModule,
    RepositoryModule,
    ConfigModule.forRoot({ load: [AppConfig] }),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
  exports: [AuthenticationService]
})
export class AuthenticationModule {}
