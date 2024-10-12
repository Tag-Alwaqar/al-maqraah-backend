import { GroupAppointment } from '@group/entities/group-appointment.entity';
import { WeekdayEnum } from '@common/enums/weekday.enum';
import { ShortGroupDto } from './short-group.dto';

export class GroupAppointmentDto {
  id: number;
  created_at: Date;
  updated_at: Date;
  weekday: WeekdayEnum;
  start_time: string;
  end_time: string;
  group: ShortGroupDto;
  constructor(appointment: GroupAppointment) {
    this.id = appointment.id;
    this.created_at = appointment.created_at;
    this.updated_at = appointment.updated_at;
    this.weekday = appointment.weekday;
    this.start_time = appointment.start_time;
    this.end_time = appointment.end_time;
    if (appointment.group) {
      this.group = new ShortGroupDto(appointment.group);
    }
  }
}
