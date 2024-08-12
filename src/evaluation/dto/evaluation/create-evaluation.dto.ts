import { IsBoolean, IsInt, IsNotEmpty } from 'class-validator';

export class CreateEvaluationDto {
  @IsNotEmpty()
  @IsInt()
  group_id: number;

  @IsNotEmpty()
  @IsInt()
  student_id: number;

  @IsNotEmpty()
  @IsBoolean()
  ethics_grade: boolean;
}
