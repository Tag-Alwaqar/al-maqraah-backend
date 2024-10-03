import { GroupType } from '@group/enums/group-type.enum';
import { Group } from '@group/entities/group.entity';
import { AdminDto, StudentDto } from '@user/dto/user.dto';
import { Gender } from '@user/enums/gender.enum';
import { GroupAppointmentDto } from './group-appointment.dto';

export class GroupDto {
  id: number;
  created_at: Date;
  updated_at: Date;
  name: string;
  type: GroupType;
  gender: Gender;
  admin?: AdminDto;
  students?: StudentDto[];
  appointments?: GroupAppointmentDto[];
  constructor(group: Group) {
    this.id = group.id;
    this.created_at = group.created_at;
    this.updated_at = group.updated_at;
    this.name = group.name;
    this.type = group.type;
    this.gender = group.gender;
    if (group.admin) {
      this.admin = new AdminDto(group.admin);
    }
    if (group.students && group.students.length > 0) {
      this.students = group.students.map((student) => new StudentDto(student));
    }
    if (group.appointments && group.appointments.length > 0) {
      this.appointments = group.appointments.map(
        (appointment) => new GroupAppointmentDto(appointment),
      );
    }
  }
}
