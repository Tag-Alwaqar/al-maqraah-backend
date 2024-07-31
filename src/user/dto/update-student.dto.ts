import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class UpdateStudentDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(114)
  current_surah?: number;

  @IsOptional()
  @IsInt()
  current_ayah?: number;
}
