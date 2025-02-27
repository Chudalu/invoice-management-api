import { Resolver, Query } from '@nestjs/graphql';
import { ReportsService } from '../reports.service';
import { UserReportDto } from '../dto/user-report.dto';
import { Roles } from 'src/app/repository/constants/roles-decorator.constants';
import { RoleEnum } from 'src/app/repository/enum/role.enum';

@Roles([RoleEnum.ADMIN])
@Resolver(() => UserReportDto)
export class UserReportResolver {
  constructor(private readonly reportsService: ReportsService) {}

  @Query(() => UserReportDto, {name: 'getUserReport'})
  async getUserReport(): Promise<UserReportDto> {
    return await this.reportsService.getUserReport();
  }
}

