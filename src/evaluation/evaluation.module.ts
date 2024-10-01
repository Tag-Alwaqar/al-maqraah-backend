import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '@common/common.module';
import { UserModule } from '@user/user.module';
import { QuraanEvaluation } from './entities/quraan-evaluation.entity';
import { ShariaEvaluation } from './entities/sharia-evaluation.entity';
import { ExamEvaluation } from './entities/exam-evaluation.entity';
import { QuraanEvaluationController } from './controllers/quraan-evaluation.controller';
import { QuraanEvaluationsService } from './services/quraan-evaluation.service';
import { GroupModule } from '@group/group.module';
import { ShariaEvaluationController } from './controllers/sharia-evaluation.controller';
import { ExamEvaluationController } from './controllers/exam-evaluation.controller';
import { ShariaEvaluationsService } from './services/sharia-evaluation.service';
import { ExamEvaluationsService } from './services/exam-evaluation.service';
import { SessionModule } from '@session/session.module';
import { QuraanExamEvaluation } from './entities/quraan-exam-evaluation.entity';
import { QuraanExamEvaluationController } from './controllers/quraan-exam-evaluation.controller';
import { QuraanExamEvaluationsService } from './services/quraan-exam-evaluation.service';

@Module({
  imports: [
    UserModule,
    GroupModule,
    TypeOrmModule.forFeature([
      QuraanEvaluation,
      ShariaEvaluation,
      ExamEvaluation,
      QuraanExamEvaluation,
    ]),
    CommonModule,
    SessionModule,
  ],
  controllers: [
    QuraanEvaluationController,
    ShariaEvaluationController,
    ExamEvaluationController,
    QuraanExamEvaluationController,
  ],
  providers: [
    QuraanEvaluationsService,
    ShariaEvaluationsService,
    ExamEvaluationsService,
    QuraanExamEvaluationsService,
  ],
  exports: [
    QuraanEvaluationsService,
    ShariaEvaluationsService,
    ExamEvaluationsService,
    QuraanExamEvaluationsService,
  ],
})
export class EvaluationModule {}
