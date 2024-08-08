import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ExamEvaluationsQueryDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  group_id?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  student_id?: number;
}
