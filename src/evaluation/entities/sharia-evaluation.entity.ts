import { Column, Entity } from 'typeorm';
import { Evaluation } from './evaluation.entity';

@Entity({ name: 'sharia_evaluation' })
export class ShariaEvaluation extends Evaluation {
  @Column('bool')
  attended: boolean;
}
