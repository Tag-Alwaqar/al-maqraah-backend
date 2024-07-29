import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { SoftDeletableEntity } from '@common/entities/soft-deletable.entity';

@Entity({ name: 'teachers' })
export class Teacher extends SoftDeletableEntity {
  @Column()
  user_id: number;

  @OneToOne(() => User, (user) => user.teacher)
  @JoinColumn({ name: 'user_id' })
  user: User;

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
