import {
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';

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
  @IsString()
  @Matches(/^\d{4}-\d{2}$/, {
    message: 'Month must be in the format of year-month',
  })
  month: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(114)
  from: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(114)
  to: number;

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
