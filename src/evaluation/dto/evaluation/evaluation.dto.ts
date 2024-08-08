import { GroupDto } from '@group/dto/group.dto';

export class EvaluationDto {
  id: number;
  created_at: Date;
  updated_at: Date;
  group: GroupDto;
  student: ReverseStudentDto;
  teacher: ReverseTeacherDto;
  admin?: AdminDto;
  students?: StudentDto[];
  constructor(evaluation: Evaluation) {
    this.id = evaluation.id;
    this.created_at = evaluation.created_at;
    this.updated_at = evaluation.updated_at;
    this.name = evaluation.name;
    this.type = evaluation.type;
    this.gender = evaluation.gender;
    if (evaluation.admin) {
      this.admin = new AdminDto(evaluation.admin);
    }
    if (evaluation.students && evaluation.students.length > 0) {
      this.students = evaluation.students.map(
        (student) => new StudentDto(student),
      );
    }
  }
}
