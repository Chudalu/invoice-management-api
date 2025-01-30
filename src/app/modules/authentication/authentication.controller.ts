import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { CookieOptions, Request, Response } from 'express';
import { AuthenticateDto } from './dto/authenticate.dto';
import { Public } from 'src/app/repository/constants/public-decorator.constants';
import { APIResponseDto } from 'src/app/repository/dto/api-response.dto';
import { AuthenticationResponseDto } from './dto/authentication-response.dto';
import { LoggedInUserDto } from './dto/loggedin-user.dto';
import * as requestIp from 'request-ip';
import { ApiTags, ApiExtraModels } from '@nestjs/swagger';

@ApiTags('Authentication')
@ApiExtraModels(LoggedInUserDto)
@Controller('authentication')
export class AuthenticationController {

  constructor(
    private readonly authenticationService: AuthenticationService,
  ) { }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Body() authenticateDto: AuthenticateDto):
    Promise<AuthenticationResponseDto> {
    let ipAddress = requestIp.getClientIp(request);
    let { jwtToken, authenticationToken } = await this.authenticationService.login(authenticateDto, ipAddress);
    this.setAuthenticationCookie(response, authenticationToken);
    return new AuthenticationResponseDto(jwtToken);
  }

  @Public()
  @Get('refresh')
  async refreshAuthentication(@Req() request: Request, @Res({ passthrough: true }) response: Response):
    Promise<AuthenticationResponseDto> {
    let oldAuthenticationToken = request.cookies?.authenticationToken;
    let ipAddress = requestIp.getClientIp(request);
    let { jwtToken, authenticationToken } = await this.authenticationService.refreshAuthentication(oldAuthenticationToken, ipAddress);
    this.setAuthenticationCookie(response, authenticationToken);
    return new AuthenticationResponseDto(jwtToken);
  }

  @Get('logout')
  async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<APIResponseDto> {
    let authenticationToken = request.cookies.authenticationToken;
    let user: LoggedInUserDto = request['user'];
    let token = await this.authenticationService.revokeAuthentication(user, authenticationToken);
    this.setAuthenticationCookie(response, token);
    return new APIResponseDto('token revoked');
  }

  private setAuthenticationCookie(response: Response, authenticationToken: string) {
    let cookieOptions: CookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), //expire in 7 days (week)
      sameSite: 'none',
      secure: true
    };
    response.cookie('authenticationToken', authenticationToken, cookieOptions);
  }
}