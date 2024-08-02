import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { SoftDeletableEntity } from '@common/entities/soft-deletable.entity';
import { GroupType } from '@group/enums/group-type.enum';
import { Gender } from '@user/enums/gender.enum';
import { Admin } from '@user/entities/admin.entity';
import { Student } from '@user/entities/student.entity';

@Entity({ name: 'groups' })
export class Group extends SoftDeletableEntity {
  @Index({ unique: true, where: 'deleted_at IS NULL' })
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  type: GroupType;

  @Column()
  gender: Gender;

  @Column({ type: 'int', nullable: true })
  admin_id?: number;

  @ManyToOne(() => Admin, (admin) => admin.groups, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'admin_id' })
  admin?: Admin;

  @ManyToMany(() => Student, (student) => student.groups, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinTable()
  students?: Student[];

  // @OneToMany(() => QuraanEvaluation, (evaluation) => evaluation.group, {
  //   nullable: true,
  // })
  // quraan_evaluations?: QuraanEvaluation[];

  // @OneToMany(() => ShariaEvaluation, (evaluation) => evaluation.group, {
  //   nullable: true,
  // })
  // sharia_evaluations?: ShariaEvaluation[];
}
