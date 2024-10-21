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
  month: string;
  from: number;
  to: number;
  memorizing_grade: number;
  max_memorizing_grade: number;
  tajweed_grade: number;
  max_tajweed_grade: number;
  constructor(quraanExamEvaluation: QuraanExamEvaluation) {
    this.id = quraanExamEvaluation.id;
    this.created_at = quraanExamEvaluation.created_at;
    this.updated_at = quraanExamEvaluation.updated_at;
    this.name = quraanExamEvaluation.name;
    this.group = new GroupDto(quraanExamEvaluation.group);
    this.student = new ReversedStudentDto(quraanExamEvaluation.student);
    this.month = quraanExamEvaluation.month;
    this.from = quraanExamEvaluation.from;
    this.to = quraanExamEvaluation.to;
    this.memorizing_grade = quraanExamEvaluation.memorizing_grade;
    this.max_memorizing_grade = quraanExamEvaluation.max_memorizing_grade;
    this.tajweed_grade = quraanExamEvaluation.tajweed_grade;
    this.max_tajweed_grade = quraanExamEvaluation.max_tajweed_grade;
  }
}
