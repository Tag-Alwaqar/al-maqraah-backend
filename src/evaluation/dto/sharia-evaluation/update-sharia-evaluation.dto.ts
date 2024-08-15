import { PartialType } from '@nestjs/mapped-types';
import { CreateShariaEvaluationDto } from './create-sharia-evaluation.dto';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateShariaEvaluationDto extends PartialType(
  CreateShariaEvaluationDto,
) {
  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  ethics_grade?: boolean;
}
