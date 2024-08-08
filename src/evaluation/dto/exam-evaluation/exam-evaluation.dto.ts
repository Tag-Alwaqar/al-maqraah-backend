import { ExamEvaluation } from '@evaluation/entities/exam-evaluation.entity';
import { GroupDto } from '@group/dto/group.dto';
import { ReverseStudentDto } from '@user/dto/user.dto';

export class ExamEvaluationDto {
  id: number;
  created_at: Date;
  updated_at: Date;
  name: string;
  group: GroupDto;
  student: ReverseStudentDto;
  max_grade: number;
  grade: number;
  constructor(examEvaluation: ExamEvaluation) {
    this.id = examEvaluation.id;
    this.created_at = examEvaluation.created_at;
    this.updated_at = examEvaluation.updated_at;
    this.name = examEvaluation.name;
    this.group = new GroupDto(examEvaluation.group);
    this.student = new ReverseStudentDto(examEvaluation.student);
    this.max_grade = examEvaluation.max_grade;
  }
}
