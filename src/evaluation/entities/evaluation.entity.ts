import { Column, JoinColumn, ManyToOne } from 'typeorm';
import { SoftDeletableEntity } from '@common/entities/soft-deletable.entity';
import { Group } from '@group/entities/group.entity';
import { Student } from '@user/entities/student.entity';
import { Teacher } from '@user/entities/teacher.entity';

export interface Revision {
  start_surah: number;
  end_surah: number;
  grade?: number; // 0 to 5
}

export class NewSurah {
  start_ayah: number;
  end_ayah: number;
  grade?: number; // 0 to 5
}

export abstract class Evaluation extends SoftDeletableEntity {
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
  teacher_id: number;

  @ManyToOne(() => Teacher, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'teacher_id' })
  teacher: Teacher;

  @Column({ type: 'bool' })
  ethics_grade: boolean;

  @Column({ type: 'int' })
  duration: number;
}
