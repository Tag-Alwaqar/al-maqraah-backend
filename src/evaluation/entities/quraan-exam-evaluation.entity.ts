import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SoftDeletableEntity } from '@common/entities/soft-deletable.entity';
import { Group } from '@group/entities/group.entity';
import { Student } from '@user/entities/student.entity';

@Entity({ name: 'quraan_exam_evaluation' })
export class QuraanExamEvaluation extends SoftDeletableEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'int' })
  group_id: number;

  @ManyToOne(() => Group, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @Column({ type: 'int' })
  student_id: number;

  @ManyToOne(() => Student, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ type: 'int' })
  memorizing_grade: number;

  @Column({ type: 'int', default: 100 })
  max_memorizing_grade: number;

  @Column({ type: 'int' })
  tajweed_grade: number;

  @Column({ type: 'int', default: 100 })
  max_tajweed_grade: number;
}
