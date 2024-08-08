import { PartialType } from '@nestjs/mapped-types';
import { CreateShariaEvaluationDto } from './create-sharia-evaluation.dto';

export class UpdateShariaEvaluationDto extends PartialType(
  CreateShariaEvaluationDto,
) {}
