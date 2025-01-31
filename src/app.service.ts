import { Injectable } from '@nestjs/common';
import { APIResponseDto } from './app/repository/dto/api-response.dto';

@Injectable()
export class AppService {
  getHealth(): APIResponseDto {
    return new APIResponseDto('server healthy');
  }
}
