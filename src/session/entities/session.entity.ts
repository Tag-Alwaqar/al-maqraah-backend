import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SoftDeletableEntity } from '@common/entities/soft-deletable.entity';
import { Group } from '@group/entities/group.entity';
import { Teacher } from '@user/entities/teacher.entity';

@Entity({ name: 'sessions' })
export class Session extends SoftDeletableEntity {
  @Column({ type: 'int' })
  group_id: number;

  @ManyToOne(() => Group, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @Column({ type: 'int' })
  teacher_id: number;

  @ManyToOne(() => Teacher, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'teacher_id' })
  teacher: Teacher;

  @Column({ type: 'int' })
  duration: number;
}
