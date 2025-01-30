import { Global, Module } from '@nestjs/common';
import { BcryptService } from './services/bcrypt/bcrypt.service';
import { EncryptionService } from './services/encryption/encryption.service';
import { ConfigModule } from '@nestjs/config';
import { AppConfig } from 'src/app.config';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({ load: [AppConfig] }),
    ],
    providers: [
        BcryptService,
        EncryptionService,
    ],
    exports: [
        BcryptService,
        EncryptionService,
    ]
})
export class UtilitiesModule {}
