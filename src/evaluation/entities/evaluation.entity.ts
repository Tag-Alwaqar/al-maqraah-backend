import { Column, JoinColumn, ManyToOne } from 'typeorm';
import { SoftDeletableEntity } from '@common/entities/soft-deletable.entity';
import { Group } from '@group/entities/group.entity';
import { Student } from '@user/entities/student.entity';
import { Teacher } from '@user/entities/teacher.entity';
import { IsNotEmpty, IsInt, IsOptional, Min, Max } from 'class-validator';

export class Revision {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(114)
  start_surah: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(114)
  end_surah: number;

  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  grade?: number; // 0 to 5
}

export class NewSurah {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(114)
  surah: number;

  @IsNotEmpty()
  @IsInt()
  start_ayah: number;

  @IsNotEmpty()
  @IsInt()
  end_ayah: number;

  @IsOptional()
  @IsNotEmpty()
  @IsInt()
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
