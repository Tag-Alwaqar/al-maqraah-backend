import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class EvaluationsQueryDto {
  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  group_id?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  student_id?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  teacher_id?: number;
}
