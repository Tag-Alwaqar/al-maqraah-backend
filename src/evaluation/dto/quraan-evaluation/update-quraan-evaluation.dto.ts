import { PartialType } from '@nestjs/mapped-types';
import { CreateQuraanEvaluationDto } from './create-quraan-evaluation.dto';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateQuraanEvaluationDto extends PartialType(
  CreateQuraanEvaluationDto,
) {
  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  ethics_grade?: boolean;
}
