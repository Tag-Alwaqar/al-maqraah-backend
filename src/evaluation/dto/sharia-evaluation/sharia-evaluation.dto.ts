import { ShariaEvaluation } from '@evaluation/entities/sharia-evaluation.entity';
import { EvaluationDto } from '../evaluation/evaluation.dto';

export class ShariaEvaluationDto extends EvaluationDto {
  attended: boolean;
  constructor(shariaEvaluation: ShariaEvaluation) {
    super(shariaEvaluation);
    this.attended = shariaEvaluation.attended;
  }
}
