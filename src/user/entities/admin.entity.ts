import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { SoftDeletableEntity } from '@common/entities/soft-deletable.entity';

@Entity({ name: 'admins' })
export class Admin extends SoftDeletableEntity {
  @Column()
  user_id: number;

  @OneToOne(() => User, (user) => user.admin)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // @Column()
  // user_id: number;
  //   @OneToMany(() => Group, {
  //     onDelete: 'SET NULL',
  //     nullable: true,
  //   })
  //   @JoinTable()
  //   groups?: Group[];
  //   @OneToMany(() => Fees, {
  //     onDelete: 'SET NULL',
  //     nullable: true,
  //   })
  //   @JoinTable()
  //   fees?: Fees[];
}
