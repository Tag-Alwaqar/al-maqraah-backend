import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ClsModule } from 'nestjs-cls';
import databaseConfig from './database/database.config';
import { UserModule } from '@user/user.module';
import { CommonModule } from '@common/common.module';
import { HttpExceptionFilter } from '@common/filters/exception.filter';
import { BadRequestExceptionFilter } from '@common/filters/bad-request.filter';
import { ResponseInterceptor } from '@common/interceptors/response.interceptor';
import { GroupModule } from '@group/group.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(databaseConfig),
    UserModule,
    CommonModule,
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),
    GroupModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: BadRequestExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
