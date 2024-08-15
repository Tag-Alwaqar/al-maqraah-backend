import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateEvaluationDto } from './create-evaluation.dto';

class OmittedCreateEvaluationDto extends OmitType(CreateEvaluationDto, [
  'student_id',
  'group_id',
]) {}

export class UpdateEvaluationDto extends PartialType(
  OmittedCreateEvaluationDto,
) {}
