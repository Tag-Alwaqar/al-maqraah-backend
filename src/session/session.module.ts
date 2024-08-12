import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '@common/common.module';
import { UserModule } from '@user/user.module';
import { GroupModule } from '@group/group.module';
import { Session } from './entities/session.entity';
import { SessionController } from './controllers/session.controller';
import { SessionsService } from './services/session.service';

@Module({
  imports: [
    UserModule,
    GroupModule,
    TypeOrmModule.forFeature([Session]),
    CommonModule,
  ],
  controllers: [SessionController],
  providers: [SessionsService],
  exports: [SessionsService],
})
export class SessionModule {}
