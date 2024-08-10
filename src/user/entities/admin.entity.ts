import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { SoftDeletableEntity } from '@common/entities/soft-deletable.entity';
import { Group } from '@group/entities/group.entity';

@Entity({ name: 'admins' })
export class Admin extends SoftDeletableEntity {
  @Column()
  user_id: number;

  @OneToOne(() => User, (user) => user.admin, {
    onDelete: 'CASCADE',
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'bool', default: false })
  is_super: boolean;

  @OneToMany(() => Group, (group) => group.admin, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  groups?: Group[];

  //   @OneToMany(() => Fees, {
  //     onDelete: 'SET NULL',
  //     nullable: true,
  //   })
  //   @JoinTable()
  //   fees?: Fees[];
}
