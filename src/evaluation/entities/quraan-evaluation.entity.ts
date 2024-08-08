import { Column, Entity } from 'typeorm';
import { Evaluation } from './evaluation.entity';
import { Revision } from '@evaluation/interfaces/revision.interface';
import { NewSurah } from '@evaluation/interfaces/new-surah.interface';

@Entity({ name: 'quraan_evaluation' })
export class QuraanEvaluation extends Evaluation {
  @Column({ type: 'json' })
  current_revision: Revision;

  @Column({ type: 'json' })
  next_revision: Revision;

  @Column({ type: 'json' })
  current_new_surah: NewSurah;

  @Column({ type: 'json' })
  next_new_surah: NewSurah;

  @Column('int')
  tajweed_grade: number; // 0 to 5
}
