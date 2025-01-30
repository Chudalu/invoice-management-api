import { Test, TestingModule } from '@nestjs/testing';
import { BcryptService } from './bcrypt.service';

describe('BcryptService', () => {
  let service: BcryptService;
  let entry = 'value to hash';
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BcryptService],
    }).compile();

    service = module.get<BcryptService>(BcryptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be hashed', async () => {
    expect(await service.hash(entry)).toBeDefined();
  });

  it('should compare hashed output and original input for similarity', async () => {
    let hashed = await service.hash(entry);
    expect(await service.compare(entry, hashed)).toBeTruthy();
  });
});
