import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { APIResponseDto } from './app/repository/dto/api-response.dto';
import { Public } from './app/repository/constants/public-decorator.constants';

@ApiTags('Application')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHealth(): APIResponseDto {
    return this.appService.getHealth();
  }
}
