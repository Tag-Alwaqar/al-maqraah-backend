import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '@common/common.module';
import { UserModule } from '@user/user.module';
import { Group } from './entities/group.entity';
import { GroupController } from './controllers/group.controller';
import { GroupsService } from './services/group.service';
import { Student } from '@user/entities/student.entity';
import { User } from '@user/entities/user.entity';
import { Admin } from '@user/entities/admin.entity';

@Module({
  imports: [
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([Group, Student, Admin, User]),
    CommonModule,
  ],
  controllers: [GroupController],
  providers: [GroupsService],
  exports: [GroupsService],
})
export class GroupModule {}
