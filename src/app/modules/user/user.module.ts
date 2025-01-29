import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RepositoryModule } from 'src/app/repository/repository.module';
import { UtilitiesModule } from 'src/app/utilities/utilities.module';

@Module({
  imports: [
    UtilitiesModule,
    RepositoryModule
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
