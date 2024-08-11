import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { User } from './user.entity';
import { SoftDeletableEntity } from '@common/entities/soft-deletable.entity';
import { Group } from '@group/entities/group.entity';
import { Fees } from '@fees/entities/fees.entity';

@Entity({ name: 'students' })
export class Student extends SoftDeletableEntity {
  @Column()
  user_id: number;

  @OneToOne(() => User, (user) => user.student, {
    onDelete: 'CASCADE',
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'int' })
  current_surah: number;

  @Column({ type: 'int', nullable: true })
  current_ayah?: number;

  @ManyToMany(() => Group, (group) => group.students, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  groups?: Group[];

  @OneToMany(() => Fees, (fees) => fees.student, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinTable()
  fees?: Fees[];
}
