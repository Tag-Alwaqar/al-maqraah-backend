import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateExamEvaluationDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsInt()
  group_id: number;

  @IsNotEmpty()
  @IsInt()
  student_id: number;

  @IsNotEmpty()
  @IsInt()
  max_grade: number;

  @IsNotEmpty()
  @IsInt()
  grade: number;
}
