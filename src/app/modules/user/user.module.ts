import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { RepositoryModule } from 'src/app/repository/repository.module';
import { UtilitiesModule } from 'src/app/utilities/utilities.module';
import { UserController } from './user/user.controller';

@Module({
  imports: [
    UtilitiesModule,
    RepositoryModule
  ],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController]
})
export class UserModule {}
