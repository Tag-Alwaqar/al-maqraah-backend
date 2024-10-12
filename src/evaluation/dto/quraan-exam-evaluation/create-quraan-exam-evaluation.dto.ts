import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateQuraanExamEvaluationDto {
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
  memorizing_grade: number;

  @IsNotEmpty()
  @IsInt()
  max_memorizing_grade: number;

  @IsNotEmpty()
  @IsInt()
  tajweed_grade: number;

  @IsNotEmpty()
  @IsInt()
  max_tajweed_grade: number;
}
