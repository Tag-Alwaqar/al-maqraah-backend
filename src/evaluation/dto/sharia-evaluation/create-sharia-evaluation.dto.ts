import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';
import { CreateEvaluationDto } from '../evaluation/create-evaluation.dto';

export class CreateShariaEvaluationDto extends CreateEvaluationDto {
  @IsNotEmpty()
  @IsBoolean()
  attended: boolean;
}
