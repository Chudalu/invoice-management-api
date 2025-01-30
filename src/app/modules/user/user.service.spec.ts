import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/sequelize';
import { RoleEnum } from 'src/app/repository/enum/role.enum';
import { EntityStatus } from 'src/app/repository/enum/entity-status.enum';
import { User } from './entities/user.entity';
import { UtilitiesModule } from 'src/app/utilities/utilities.module';
import { BcryptService } from 'src/app/utilities/services/bcrypt/bcrypt.service';
import { ConfigModule } from '@nestjs/config';
import { AppConfig } from 'src/app.config';
import { ConflictException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let bcryptService: BcryptService;

  let mockUser = {
    id: 1,
    userName: 'firstUser',
    email: 'firstuser@email.com',
    passwordHash: 'passwordHash',
    role: RoleEnum.USER,
    status: EntityStatus.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
    notifications: [],
    authentication: null,
  }
  let userArray = [mockUser];
  let mockUserRepository = {
    findOne: jest.fn().mockResolvedValue(null),
    findByPk: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockImplementation((dto) => Promise.resolve({ ...dto, id: userArray.length+1})),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User),
          useValue: mockUserRepository
        }
      ],
      imports: [
        UtilitiesModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [AppConfig]
        }),
      ]
    }).compile();

    service = module.get<UserService>(UserService);
    bcryptService = module.get<BcryptService>(BcryptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user', async () => {
    jest.spyOn(bcryptService, 'hash').mockResolvedValue('hashedpassword');

    const newUser = await service.create({
      userName: 'user',
      email: 'user@email.com',
      password: 'plainPassword',
      role: RoleEnum.USER,
    });
    console.log(newUser)
    expect(mockUserRepository.create).toHaveBeenCalled();
    expect(newUser).toHaveProperty('id');
    expect(newUser.userName).toBe('user');
  });

  it('should throw an error when creating a duplicate user', async () => {
    mockUserRepository.findOne = jest.fn().mockResolvedValue(mockUser);

    await expect(service.create({
      userName: 'user',
      email: 'user@email.com',
      password: 'plainPassword',
      role: RoleEnum.USER,
    })).rejects.toThrow(ConflictException);
  });

  it('should find a user by ID', async () => {
    const user = await service.findOneById(1);
    expect(user).toEqual(mockUser);
  });
});
