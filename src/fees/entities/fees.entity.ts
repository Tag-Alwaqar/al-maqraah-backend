import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SoftDeletableEntity } from '@common/entities/soft-deletable.entity';
import { Group } from '@group/entities/group.entity';
import { Student } from '@user/entities/student.entity';
import { Admin } from '@user/entities/admin.entity';

@Entity({ name: 'fees' })
export class Fees extends SoftDeletableEntity {
  @Column({ type: 'int' })
  admin_id: number;

  @ManyToOne(() => Admin, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'admin_id' })
  admin: Admin;

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

  @Column({ type: 'float' })
  price: number;
}
