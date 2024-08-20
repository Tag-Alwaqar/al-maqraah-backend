import { Column, Entity, Unique } from 'typeorm';
import {
  Evaluation,
  NewSurah,
  NextNewSurah,
  NextRevision,
  Revision,
} from './evaluation.entity';

@Entity({ name: 'quraan_evaluation' })
@Unique(['session_id', 'student_id'])
export class QuraanEvaluation extends Evaluation {
  @Column({ type: 'json' })
  current_revision: Revision;

  @Column({ type: 'json' })
  next_revision: NextRevision;

  @Column({ type: 'json' })
  current_new_surah: NewSurah;

  @Column({ type: 'json' })
  next_new_surah: NextNewSurah;

  @Column('int')
  tajweed_grade: number; // 0 to 5
}
