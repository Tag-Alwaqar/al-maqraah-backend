import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '@common/common.module';
import { UserModule } from '@user/user.module';
import { GroupModule } from '@group/group.module';
import { Fees } from './entities/fees.entity';
import { FeesController } from './controllers/fees.controller';
import { FeesService } from './services/fees.service';

@Module({
  imports: [
    UserModule,
    GroupModule,
    TypeOrmModule.forFeature([Fees]),
    CommonModule,
  ],
  controllers: [FeesController],
  providers: [FeesService],
  exports: [FeesService],
})
export class FeesModule {}
