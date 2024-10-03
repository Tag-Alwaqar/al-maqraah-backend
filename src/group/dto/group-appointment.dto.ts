import { GroupAppointment } from '@group/entities/group-appointment.entity';
import { WeekdayEnum } from '@common/enums/weekday.enum';

export class GroupAppointmentDto {
  id: number;
  created_at: Date;
  updated_at: Date;
  weekday: WeekdayEnum;
  startTime: string;
  endTime: string;
  constructor(appointment: GroupAppointment) {
    this.id = appointment.id;
    this.created_at = appointment.created_at;
    this.updated_at = appointment.updated_at;
    this.weekday = appointment.weekday;
    this.startTime = appointment.startTime;
    this.endTime = appointment.endTime;
  }
}
