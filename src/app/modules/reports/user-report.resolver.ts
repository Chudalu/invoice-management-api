import { Resolver, Query } from '@nestjs/graphql';
import { ReportsService } from './reports.service';
import { UserReportDto } from './dto/user-report.dto';
import { Public } from 'src/app/repository/constants/public-decorator.constants';

@Public()
@Resolver(() => UserReportDto)
export class UserReportResolver {
  constructor(private readonly reportsService: ReportsService) {
      console.log('resolver initialized')
  }

  @Query(() => UserReportDto, {name: 'getUserReport'})
  async getUserReport(): Promise<UserReportDto> {
    return await this.reportsService.getUserReport();
  }
}

