import { NewSurah, Revision } from '@evaluation/entities/evaluation.entity';
import { EvaluationDto } from '../evaluation/evaluation.dto';
import { QuraanEvaluation } from '@evaluation/entities/quraan-evaluation.entity';

export class QuraanEvaluationDto extends EvaluationDto {
  current_revision: Revision;
  next_revision: Revision;
  current_new_surah: NewSurah;
  next_new_surah: NewSurah;
  tajweed_grade: number; // 0 to 5
  constructor(quraanEvaluation: QuraanEvaluation) {
    super(quraanEvaluation);
    this.current_revision = quraanEvaluation.current_revision;
    this.next_revision = quraanEvaluation.next_revision;
    this.current_new_surah = quraanEvaluation.current_new_surah;
    this.next_new_surah = quraanEvaluation.next_new_surah;
    this.tajweed_grade = quraanEvaluation.tajweed_grade;
  }
}
