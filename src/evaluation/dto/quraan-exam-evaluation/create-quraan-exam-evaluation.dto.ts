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
  memorizing: number;

  @IsNotEmpty()
  @IsInt()
  tajweed: number;
}
