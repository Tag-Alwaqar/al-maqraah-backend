import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateExamEvaluationDto } from './create-exam-evaluation.dto';

class OmittedCreateExamEvaluationDto extends OmitType(CreateExamEvaluationDto, [
  'student_id',
  'group_id',
]) {}

export class UpdateExamEvaluationDto extends PartialType(
  OmittedCreateExamEvaluationDto,
) {}
