import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/app/repository/constants/public-decorator.constants';
import { LoggedInUserDto } from 'src/app/modules/authentication/dto/loggedin-user.dto';
import { Request } from 'express';
import { EntityStatus } from 'src/app/repository/enum/entity-status.enum';
import { CLIENT_ENCRYPTION_KEY, JWT_SECRET } from 'src/app/repository/constants/env-variables.constants';
import { EncryptionService } from 'src/app/utilities/services/encryption/encryption.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {

  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private configService: ConfigService,
    private encryptionService: EncryptionService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
    if (isPublic) return true;
    let request = context.switchToHttp().getRequest();
    let token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException('Unauthenticated');
    try {
      let { account, channel } = await this.jwtService.verifyAsync(token, { secret: this.configService.get<string>(JWT_SECRET) });
      let loggedInUser: LoggedInUserDto = JSON.parse(this.santizeJSONString(this.encryptionService.decrypt(account, this.configService.getOrThrow<string>(CLIENT_ENCRYPTION_KEY))));
      if (loggedInUser.status != EntityStatus.ACTIVE) throw new UnauthorizedException('Inactive account');
      request['user'] = loggedInUser;
    } catch {
      throw new UnauthorizedException('Unauthenticated');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    let [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private santizeJSONString(str:string) {
    return str.replace(/[\x00-\x1F\x7F]/g, '');
  }
}
