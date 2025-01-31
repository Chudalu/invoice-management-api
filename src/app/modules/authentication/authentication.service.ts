import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Authentication } from './entities/authentication.entity';
import { InjectModel } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { CLIENT_ENCRYPTION_KEY, WEB_URL } from 'src/app/repository/constants/env-variables.constants';
import { APIResponseDto } from 'src/app/repository/dto/api-response.dto';
import { EncryptionService } from 'src/app/utilities/services/encryption/encryption.service';
import { UserService } from '../user/user.service';
import * as speakeasy from 'speakeasy';
import { AuthenticateDto } from './dto/authenticate.dto';
import { BcryptService } from 'src/app/utilities/services/bcrypt/bcrypt.service';
import { EntityStatus } from 'src/app/repository/enum/entity-status.enum';
import { LoggedInUserDto } from './dto/loggedin-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { User } from '../user/entities/user.entity';
import { AuthTokensDto } from './dto/auth-tokens.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthenticationService {
  
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private bcryptService: BcryptService,
    private configService: ConfigService,
    private encryptionService: EncryptionService,
    @InjectModel(Authentication) private AuthenticationRepository: typeof Authentication
  ) { }
  
  async login(authenticateDto: AuthenticateDto, ipAddress: string): Promise<AuthTokensDto> {
    let user = await this.userService.findNotDeletedUserByEmail(authenticateDto.email);
    if (!user || !(await this.bcryptService.compare(authenticateDto.password, user.passwordHash)))
      throw new UnauthorizedException('Email or Password is incorrect');
    if (user.status != EntityStatus.ACTIVE ) throw new UnauthorizedException('Account inactive');
    let authTokens = await this.getAuthTokens(user, ipAddress);
    return authTokens;
  }

  async register(createUserDto: CreateUserDto): Promise<APIResponseDto> {
    let user = await this.userService.create(createUserDto);
    await this.generateAuthentication(user.id);
    return new APIResponseDto('User registered successfully');
  }

  async refreshAuthentication(authenticationToken: string, ipAddress: string): Promise<AuthTokensDto> {
    if (!authenticationToken) throw new BadRequestException('No token');
    let { user } = await this.getUserAndValidRefreshToken(authenticationToken);
    return await this.getAuthTokens(user, ipAddress);
  }

  async revokeAuthentication(loggedInUser: LoggedInUserDto, authenticationToken: string): Promise<string> {
    let { refreshToken, user } = await this.getUserAndValidRefreshToken(authenticationToken);
    if (Number(loggedInUser.id) !== Number(user.id))
      throw new BadRequestException('Unauthorized to log user out');
    refreshToken.revoked = true;
    return this.encryptionService.encrypt(JSON.stringify(refreshToken), this.configService.getOrThrow<string>(CLIENT_ENCRYPTION_KEY));
  }

  private async getUserAndValidRefreshToken(rToken: string): Promise<{ user: User, refreshToken: RefreshTokenDto; }> {
    let refreshToken: RefreshTokenDto;
    try { refreshToken = JSON.parse(this.encryptionService.decrypt(rToken)); }
    catch (error) { throw new BadRequestException('Invalid authentication token'); }
    return { user: await this.verifyandGetLoggedInUser(refreshToken), refreshToken };
  }

  private async getAuthTokens(user: User, ipAddress: string): Promise<AuthTokensDto> {
    return new AuthTokensDto(
      await this.generateJwtToken(user),
      await this.createRefreshTokens(user.id, ipAddress)
    );
  }

  private async createRefreshTokens(userId: number, ipAddress: string): Promise<string> {
    let refreshToken = new RefreshTokenDto(
      userId,
      await this.generateRefreshTOTP(userId),
      ipAddress
    );
    return this.encryptionService.encrypt(JSON.stringify(refreshToken));
  }

  private async generateJwtToken(user: User): Promise<string> {
    let payload = new JwtPayloadDto(
      user.id, 
      this.encryptionService.encrypt(
        JSON.stringify(new LoggedInUserDto(user)), 
        this.configService.getOrThrow<string>(CLIENT_ENCRYPTION_KEY),
      )
    );
    return await this.jwtService.signAsync({...payload});
  }

  private async verifyandGetLoggedInUser(refreshToken: RefreshTokenDto): Promise<User> {
    if (!refreshToken || !refreshToken.userId || !refreshToken.password)
      throw new BadRequestException('Invalid authentication token');
    if (refreshToken.revoked) throw new UnauthorizedException('Unauthorized');
    if (!await this.verifyRefreshTokenTOTP(refreshToken.password, refreshToken.userId))
      throw new BadRequestException('Invalid authentication token');
    let user = await this.userService.findOneById(refreshToken.userId);
    if (!user) throw new BadRequestException('Invalid authentication token');
    return user;
  }

  async generateAuthentication(userId: number): Promise<void> {
    let { ascii, hex, base32, otpauth_url } = speakeasy.generateSecret({
      issuer: this.configService.get<string>(WEB_URL),
      name: 'Invoice Management System',
    });
    await this.AuthenticationRepository.create({
      ascii: this.encryptionService.encrypt(ascii),
      hex: this.encryptionService.encrypt(hex),
      base32: this.encryptionService.encrypt(base32),
      url: this.encryptionService.encrypt(otpauth_url),
      userId: userId,
    });
  }

  private async generateRefreshTOTP(userId: number): Promise<string> {
    return speakeasy.totp({
      secret: this.encryptionService.decrypt((await this.getAuthenticationByUserId(userId)).base32),
      encoding: 'base32',
      digits: 15
    });
  }

  private async verifyRefreshTokenTOTP(otp: string, userId: number): Promise<boolean> {
    return speakeasy.totp.verify({
      secret: this.encryptionService.decrypt((await this.getAuthenticationByUserId(userId)).base32),
      token: otp,
      encoding: 'base32',
      window: 10000,
      digits: 15
    });
  }

  private async getAuthenticationByUserId(id: number): Promise<Authentication> {
    let authentication = await this.AuthenticationRepository.findOne({ where: { userId: id } });
    if (!authentication) throw new NotFoundException('Authentication not found');
    return authentication;
  }

}
