import { QuraanExamEvaluation } from '@evaluation/entities/quraan-exam-evaluation.entity';
import { GroupDto } from '@group/dto/group.dto';
import { ReversedStudentDto } from '@user/dto/user.dto';

export class QuraanExamEvaluationDto {
  id: number;
  created_at: Date;
  updated_at: Date;
  name: string;
  group: GroupDto;
  student: ReversedStudentDto;
  memorizing: number;
  tajweed: number;
  constructor(quraanExamEvaluation: QuraanExamEvaluation) {
    this.id = quraanExamEvaluation.id;
    this.created_at = quraanExamEvaluation.created_at;
    this.updated_at = quraanExamEvaluation.updated_at;
    this.name = quraanExamEvaluation.name;
    this.group = new GroupDto(quraanExamEvaluation.group);
    this.student = new ReversedStudentDto(quraanExamEvaluation.student);
    this.memorizing = quraanExamEvaluation.memorizing;
    this.tajweed = quraanExamEvaluation.tajweed;
  }
}
