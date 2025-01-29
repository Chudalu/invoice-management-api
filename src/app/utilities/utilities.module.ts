import { Global, Module } from '@nestjs/common';
import { BcryptService } from './services/bcrypt/bcrypt.service';
import { EncryptionService } from './services/encryption/encryption.service';

@Global()
@Module({
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
