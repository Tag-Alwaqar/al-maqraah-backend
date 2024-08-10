import { Evaluation } from '@evaluation/entities/evaluation.entity';
import { GroupDto } from '@group/dto/group.dto';
import { ReverseStudentDto, ReverseTeacherDto } from '@user/dto/user.dto';

export class EvaluationDto {
  id: number;
  created_at: Date;
  updated_at: Date;
  group: GroupDto;
  student: ReverseStudentDto;
  teacher: ReverseTeacherDto;
  ethics_grade: boolean;
  duration: number;
  constructor(evaluation: Evaluation) {
    this.id = evaluation.id;
    this.created_at = evaluation.created_at;
    this.updated_at = evaluation.updated_at;
    this.group = new GroupDto(evaluation.group);
    this.student = new ReverseStudentDto(evaluation.student);
    this.teacher = new ReverseTeacherDto(evaluation.teacher);
    this.ethics_grade = evaluation.ethics_grade;
    this.duration = evaluation.duration;
  }
}
