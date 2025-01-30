import { Test, TestingModule } from '@nestjs/testing';
import { EncryptionService } from './encryption.service';
import { ConfigModule } from '@nestjs/config';
import { AppConfig } from 'src/app.config';

describe('EncryptionService', () => {
  let service: EncryptionService;
  let entry = 'the text to encrypt';
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EncryptionService],
      imports: [ ConfigModule.forRoot({ load: [AppConfig] }) ]
    }).compile();

    service = module.get<EncryptionService>(EncryptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be encrypted', () => {
    expect(service.encrypt(entry)).toBeDefined();
  });

  it('should be decrypt', () => {
    let encrypted = service.encrypt(entry);
    expect(service.decrypt(encrypted)).toEqual(entry);
  })
});
