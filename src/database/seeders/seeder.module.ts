import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from '../database.config';
import { User } from '@user/entities/user.entity';
import { Admin } from '@user/entities/admin.entity';
import { SeederService } from './seeder.service';
import { Teacher } from '@user/entities/teacher.entity';
import { Student } from '@user/entities/student.entity';
import { AdminSeeder } from './admin/admin.seeder';
import { Group } from '@group/entities/group.entity';
import { TeacherSeeder } from './teacher/teacher.seeder';
import { StudentSeeder } from './student/student.seeder';
import { GroupSeeder } from './group/group.seeder';
import { QuraanEvaluation } from '@evaluation/entities/quraan-evaluation.entity';
import { ShariaEvaluation } from '@evaluation/entities/sharia-evaluation.entity';
import { ExamEvaluation } from '@evaluation/entities/exam-evaluation.entity';
import { Fees } from '@fees/entities/fees.entity';
import { Session } from 'src/session/entities/session.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync(databaseConfig),
    TypeOrmModule.forFeature([
      User,
      Admin,
      Teacher,
      Student,
      Group,
      QuraanEvaluation,
      ShariaEvaluation,
      ExamEvaluation,
      Fees,
      Session,
    ]),
  ],
  providers: [
    SeederService,
    AdminSeeder,
    TeacherSeeder,
    StudentSeeder,
    GroupSeeder,
  ],
  exports: [SeederService],
})
export class SeederModule {}
