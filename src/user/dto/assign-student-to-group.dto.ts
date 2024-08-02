import { IsInt, IsNotEmpty } from 'class-validator';

export class AssignStudentToGroupDto {
  @IsNotEmpty()
  @IsInt()
  group_id: number;

  @IsNotEmpty()
  @IsInt()
  student_id: number;
}

export class RemoveStudentFromGroupDto extends AssignStudentToGroupDto {}
