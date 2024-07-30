import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { SoftDeletableEntity } from '@common/entities/soft-deletable.entity';

@Entity({ name: 'students' })
export class Student extends SoftDeletableEntity {
  @Column()
  user_id: number;

  @OneToOne(() => User, (user) => user.student, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'int' })
  current_surah: number;

  @Column({ type: 'int', nullable: true })
  current_ayah?: number;

  // @OneToMany(() => Group, {
  //   onDelete: 'SET NULL',
  //   nullable: true,
  // })
  // @JoinTable()
  // groups?: Group[];

  // @OneToMany(() => Fees, {
  //   onDelete: 'SET NULL',
  //   nullable: true,
  // })
  // @JoinTable()
  // fees?: Fees[];

  // @OneToMany(() => QuraanEvaluation, {
  //   onDelete: 'SET NULL',
  //   nullable: true,
  // })
  // @JoinTable()
  // quraan_evaluations?: QuraanEvaluation[];

  // @OneToMany(() => ShariaEvaluation, {
  //   onDelete: 'SET NULL',
  //   nullable: true,
  // })
  // @JoinTable()
  // sharia_evaluations?: ShariaEvaluation[];
}
