import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { SoftDeletableEntity } from '@common/entities/soft-deletable.entity';

@Entity({ name: 'teachers' })
export class Teacher extends SoftDeletableEntity {
  @Column()
  user_id: number;

  @OneToOne(() => User, (user) => user.teacher, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
