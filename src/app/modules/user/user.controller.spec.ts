import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { EntityStatus } from 'src/app/repository/enum/entity-status.enum';
import { RoleEnum } from 'src/app/repository/enum/role.enum';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let mockUser: any = {
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
  let mockUserService = {
    create: jest.fn().mockResolvedValue(mockUser),
    findAll: jest.fn().mockResolvedValue(userArray.map(u => new UserDto(u)))
  }
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService, useValue: mockUserService
        }
      ]
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create new user', async () => {
    let user = await controller.createUser({
      userName: 'username',
      email: 'user@email.com',
      password: 'newPassword123@',
    });
    expect(user).toBeDefined();
    expect(user).toBeInstanceOf(UserDto);
  });

  it('should get all users', async () => {
    let users = await controller.getUsers();
    expect(users).toHaveLength(1);
    expect(users[0]).toBeInstanceOf(UserDto);
  })
});
