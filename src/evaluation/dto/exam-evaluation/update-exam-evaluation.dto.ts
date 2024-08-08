import { PartialType } from '@nestjs/mapped-types';
import { CreateExamEvaluationDto } from './create-exam-evaluation.dto';

export class UpdateExamEvaluationDto extends PartialType(
  CreateExamEvaluationDto,
) {}
