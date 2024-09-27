import { Evaluation } from '@evaluation/entities/evaluation.entity';
import { GroupDto } from '@group/dto/group.dto';
import { ReversedStudentDto, ReversedTeacherDto } from '@user/dto/user.dto';
import { SessionDto } from '@session/dto/session.dto';

export class EvaluationDto {
  id: number;
  created_at: Date;
  updated_at: Date;
  group: GroupDto;
  student: ReversedStudentDto;
  teacher: ReversedTeacherDto;
  session: SessionDto;
  ethics_grade: boolean;
  notes: string;
  constructor(evaluation: Evaluation) {
    this.id = evaluation.id;
    this.created_at = evaluation.created_at;
    this.updated_at = evaluation.updated_at;
    this.group = new GroupDto(evaluation.group);
    this.student = new ReversedStudentDto(evaluation.student);
    this.teacher = new ReversedTeacherDto(evaluation.teacher);
    this.session = new SessionDto(evaluation.session);
    this.ethics_grade = evaluation.ethics_grade;
    this.notes = evaluation.notes;
  }
}
