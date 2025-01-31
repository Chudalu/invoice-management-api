import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { AuthTokensDto } from './dto/auth-tokens.dto';
import { APIResponseDto } from 'src/app/repository/dto/api-response.dto';
import { request, response } from 'express';
import { AuthenticationResponseDto } from './dto/authentication-response.dto';

describe('AuthenticationController', () => {
  let controller: AuthenticationController;
  let mockAuthenticationService = {
    login: jest.fn().mockResolvedValue(new AuthTokensDto('mocked-jwt-token', '{"userId":1,"password":"000002083539470","ip":"0.0.0.0"}')),
    register: jest.fn().mockResolvedValue(new APIResponseDto('User registered successfully')),
    refreshAuthentication: jest.fn().mockResolvedValue(new AuthTokensDto('mocked-jwt-token', '{"userId":1,"password":"000002083539470","ip":"0.0.0.0","revoked":true}')),
    revokeAuthentication: jest.fn().mockResolvedValue('{"userId":1,"password":"000002083539470","ip":"0.0.0.0","revoked":true}'),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        {
          provide: AuthenticationService, useValue: mockAuthenticationService
        }
      ],
    }).compile();

    controller = module.get<AuthenticationController>(AuthenticationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a JWT and refresh token on successful login', async () => {
    let mockResponse: any = ({...response, cookie: (any) => any});
    let authtokens = await controller.login(request, mockResponse, {email: 'user@email.com', password: 'password'});
    expect(mockAuthenticationService.login).toHaveBeenCalled();
    expect(authtokens).toBeDefined();
    expect(authtokens).toBeInstanceOf(AuthenticationResponseDto);
  });

  it('should return a JWT and new refresh token on successful validation of old refresh token', async () => {
    let mockResponse: any = ({...response, cookie: (any) => any});
    let mockRequest: any = ({cookies: { authenticationToken: '{"userId":1,"password":"000002083539470","ip":"0.0.0.0"}' } });
    let authtokens = await controller.refreshAuthentication(mockRequest, mockResponse);
    expect(mockAuthenticationService.refreshAuthentication).toHaveBeenCalled();
    expect(authtokens).toBeDefined();
    expect(authtokens).toBeInstanceOf(AuthenticationResponseDto);
  });

  it('should validate a refresh token and revoke it / logging user out', async () => {
    let mockResponse: any = ({...response, cookie: (any) => any});
    let mockRequest: any = ({cookies: { authenticationToken: '{"userId":1,"password":"000002083539470","ip":"0.0.0.0"}' } });
    let res = await controller.logout(mockRequest, mockResponse);
    expect(mockAuthenticationService.revokeAuthentication).toHaveBeenCalled();
    expect(res).toBeDefined();
    expect(res).toBeInstanceOf(APIResponseDto);
  });
});
