import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateQuraanExamEvaluationDto } from './create-quraan-exam-evaluation.dto';

class OmittedCreateQuraanExamEvaluationDto extends OmitType(
  CreateQuraanExamEvaluationDto,
  ['student_id', 'group_id'],
) {}

export class UpdateQuraanExamEvaluationDto extends PartialType(
  OmittedCreateQuraanExamEvaluationDto,
) {}
