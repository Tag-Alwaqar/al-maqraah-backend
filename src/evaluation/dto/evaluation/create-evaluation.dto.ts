import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateEvaluationDto {
  @IsNotEmpty()
  @IsInt()
  group_id: number;

  @IsNotEmpty()
  @IsInt()
  student_id: number;

  @IsNotEmpty()
  @IsInt()
  session_id: number;

  @IsNotEmpty()
  @IsBoolean()
  ethics_grade: boolean;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  notes?: string;
}
