import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { RepositoryModule } from 'src/app/repository/repository.module';
import { UtilitiesModule } from 'src/app/utilities/utilities.module';

@Module({
  imports: [
    UtilitiesModule,
    RepositoryModule
  ],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
