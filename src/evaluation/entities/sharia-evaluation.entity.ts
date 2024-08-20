import { Column, Entity, Unique } from 'typeorm';
import { Evaluation } from './evaluation.entity';

@Entity({ name: 'sharia_evaluation' })
@Unique(['session_id', 'student_id'])
export class ShariaEvaluation extends Evaluation {
  @Column('bool')
  attended: boolean;
}
