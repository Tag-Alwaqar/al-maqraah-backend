import {
  NewSurah,
  NextNewSurah,
  NextRevision,
  Revision,
} from '@evaluation/entities/evaluation.entity';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateEvaluationDto } from '../evaluation/create-evaluation.dto';

export class CreateQuraanEvaluationDto extends CreateEvaluationDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Revision)
  current_revision: Revision;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => NextRevision)
  next_revision: NextRevision;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => NewSurah)
  current_new_surah: NewSurah;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => NextNewSurah)
  next_new_surah: NextNewSurah;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(5)
  tajweed_grade: number; // 0 to 5
}
