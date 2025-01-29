import { Reflector } from '@nestjs/core';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ROLES_KEY } from 'src/app/repository/constants/roles-decorator.constants';
import { LoggedInUserDto } from 'src/app/modules/authentication/dto/loggedin-user.dto';
import { RoleEnum } from 'src/app/repository/enum/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    let requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length == 0) return true;
    let user: LoggedInUserDto = context.switchToHttp().getRequest()['user'];
    return requiredRoles.some((role) => user.role == role);
  }
}