import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppConfig } from './app.config';
import { ScheduleModule } from '@nestjs/schedule';
import { JobsModule } from './app/jobs/jobs.module';
import { UserModule } from './app/modules/user/user.module';
import { AuthenticationModule } from './app/modules/authentication/authentication.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './app/middlewares/guards/auth/auth.guard';
import { RolesGuard } from './app/middlewares/guards/roles/roles.guard';
import { RepositoryModule } from './app/repository/repository.module';
import { InvoiceModule } from './app/modules/invoice/invoice.module';
import { NotificationModule } from './app/modules/notification/notification.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ReportsModule } from './app/modules/reports/reports.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: AppConfig().JWT_SECRET,
      signOptions: { expiresIn: '30m' },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [AppConfig]
    }),
    SequelizeModule.forRoot({
      uri: AppConfig().DATABASE_URL,
      autoLoadModels: true,
      synchronize: true,
      logging: false,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      typePaths: ['./src/**/*.graphql'],
      driver: ApolloDriver,
      path: '/graphql',
      playground: true, 
      introspection: true,
      definitions: {
        path: join(process.cwd(), 'src/graphql.schema.ts'),
      },
    }),
    ScheduleModule.forRoot(),
    JobsModule,
    UserModule,
    InvoiceModule,
    ReportsModule,
    RepositoryModule,
    NotificationModule,
    AuthenticationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: AuthenticationGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
