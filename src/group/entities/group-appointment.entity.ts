import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { SoftDeletableEntity } from '@common/entities/soft-deletable.entity';
import { Group } from './group.entity';
import { WeekdayEnum } from '@common/enums/weekday.enum';

@Entity({ name: 'group_appointments' })
export class GroupAppointment extends SoftDeletableEntity {
  @Column({ type: 'enum', enum: WeekdayEnum })
  weekday: WeekdayEnum;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column({ type: 'int' })
  group_id: number;

  @ManyToOne(() => Group, (group) => group.appointments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'group_id' })
  group?: Group;
}
