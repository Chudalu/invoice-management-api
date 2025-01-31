import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from './authentication.service';
import { EntityStatus } from 'src/app/repository/enum/entity-status.enum';
import { RoleEnum } from 'src/app/repository/enum/role.enum';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/app.config';
import * as testSpeakeasy from 'speakeasy';
import * as speakeasy from 'speakeasy';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Authentication } from './entities/authentication.entity';
import { getModelToken } from '@nestjs/sequelize';
import { UtilitiesModule } from 'src/app/utilities/utilities.module';
import { BcryptService } from 'src/app/utilities/services/bcrypt/bcrypt.service';
import { EncryptionService } from 'src/app/utilities/services/encryption/encryption.service';
import { AuthTokensDto } from './dto/auth-tokens.dto';
import { UnauthorizedException } from '@nestjs/common';
import { LoggedInUserDto } from './dto/loggedin-user.dto';
import { APIResponseDto } from 'src/app/repository/dto/api-response.dto';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let bcryptService: BcryptService;
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
  let mockAuthentication = {
    id: 1,
    ascii: '/3em[d90Kmp^LOgGg7e9:$f3B2&WimP6',          
    hex: '2f33656d5b6439304b6d705e4c4f6747673765393a24663342322657696d5036',
    base32: 'F4ZWK3K3MQ4TAS3NOBPEYT3HI5TTOZJZHISGMM2CGITFO2LNKA3A',
    url: 'otpauth://totp/Invoice%20Management%20System?secret=F4ZWK3K3MQ4TAS3NOBPEYT3HI5TTOZJZHISGMM2CGITFO2LNKA3A',
    userId: 1,
    status: EntityStatus.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  let mockUserService = {
    findNotDeletedUserByEmail: jest.fn().mockResolvedValue(mockUser),
    create: jest.fn().mockResolvedValue(mockUser),
    findOneById: jest.fn().mockResolvedValue(mockUser),
  }
  let mockJwtService = {
    signAsync: jest.fn().mockReturnValue('mocked-jwt-token'),
  };
  let mockEncryptionService = {
    encrypt: jest.fn().mockImplementation((text, key?) => text),
    decrypt: jest.fn().mockImplementation((text, key?) => text),
  };
  let mockAuthenticationRepository = {
    findOne: jest.fn().mockResolvedValue(mockAuthentication),
    findByPk: jest.fn().mockResolvedValue(mockAuthentication),
    create: jest.fn().mockImplementation((dto) => Promise.resolve(mockAuthentication)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        {
          provide: UserService, useValue: mockUserService
        },
        {
          provide: JwtService, useValue: mockJwtService
        },
        {
          provide: EncryptionService, useValue: mockEncryptionService
        },
        {
          provide: getModelToken(Authentication),
          useValue: mockAuthenticationRepository
        }
      ],
      imports: [
        ConfigModule.forRoot({ load: [AppConfig] }),
        UtilitiesModule
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
    bcryptService = module.get<BcryptService>(BcryptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate credentials and return JWT and refresh tokens', async () => {
    jest.spyOn(bcryptService, 'compare').mockResolvedValue(true);
    let totp: any = testSpeakeasy.totp({ secret: mockAuthentication.base32, encoding: 'base32', digits: 15 });
    jest.spyOn(speakeasy, 'totp').mockImplementation((options) => totp);
    let auth = await service.login({email: 'user@mail.com', password: 'password'}, '0.0.0.0');
    expect(auth).toBeDefined();
    expect(auth).toBeInstanceOf(AuthTokensDto);
    expect(auth.jwtToken).toEqual('mocked-jwt-token');
  });

  it('should throw error for invalid password/credentials', async () => {
    jest.spyOn(bcryptService, 'compare').mockResolvedValue(false);
    let totp: any = testSpeakeasy.totp({ secret: mockAuthentication.base32, encoding: 'base32', digits: 15 });
    jest.spyOn(speakeasy, 'totp').mockImplementation((options) => totp);
    await expect(service.login({email: 'user@mail.com', password: 'wrongpassword'}, '0.0.0.0')).rejects.toThrow(UnauthorizedException);
  });

  it('should validate a refresh token and return new JWT and refresh tokens', async () => {
    jest.spyOn(bcryptService, 'compare').mockResolvedValue(true);
    let auth = await service.login({email: 'user@mail.com', password: 'password'}, '0.0.0.0');
    jest.spyOn(speakeasy, 'totp').mockRestore();
    let renewedAuth = await service.refreshAuthentication(auth.authenticationToken, '0.0.0.0');
    expect(renewedAuth).toBeDefined();
    expect(renewedAuth).toBeInstanceOf(AuthTokensDto);
    expect(renewedAuth.jwtToken).toEqual('mocked-jwt-token');
  });

  it('should validate refresh token and revoke it / log user out', async () => {
    jest.spyOn(bcryptService, 'compare').mockResolvedValue(true);
    let auth = await service.login({email: 'user@mail.com', password: 'password'}, '0.0.0.0');
    jest.spyOn(speakeasy, 'totp').mockRestore();
    let revokedToken = await service.revokeAuthentication(new LoggedInUserDto(mockUser), auth.authenticationToken);
    expect(revokedToken).toBeDefined();
    expect((JSON.parse(revokedToken)).revoked).toBeTruthy();
  });

  it('should register/create a new user', async () => {
    let created = await service.register({
      userName: 'newUser',
      email: 'user@email.com',
      password: 'password',
      role: RoleEnum.ADMIN
    });
    expect(created).toBeDefined();
    expect(created).toBeInstanceOf(APIResponseDto);
    expect(created.message).toEqual('User registered successfully');
  })
});
