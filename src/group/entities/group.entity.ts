import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { SoftDeletableEntity } from '@common/entities/soft-deletable.entity';
import { GroupType } from '@group/enums/group-type.enum';
import { Gender } from '@user/enums/gender.enum';
import { Admin } from '@user/entities/admin.entity';
import { Student } from '@user/entities/student.entity';
import { GroupAppointment } from './group-appointment.entity';

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

  @OneToMany(() => GroupAppointment, (appointment) => appointment.group, {
    nullable: true,
    eager: true,
  })
  appointments?: GroupAppointment[];

  @ManyToMany(() => Student, (student) => student.groups, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinTable()
  students?: Student[];
}
