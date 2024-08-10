import { Fees } from '@fees/entities/fees.entity';
import { GroupDto } from '@group/dto/group.dto';
import { ReversedAdminDto, ReversedStudentDto } from '@user/dto/user.dto';

export class FeesDto {
  id: number;
  created_at: Date;
  updated_at: Date;
  admin: ReversedAdminDto;
  group: GroupDto;
  student: ReversedStudentDto;
  price: number;
  constructor(fees: Fees) {
    this.id = fees.id;
    this.created_at = fees.created_at;
    this.updated_at = fees.updated_at;
    this.admin = new ReversedAdminDto(fees.admin);
    this.group = new GroupDto(fees.group);
    this.student = new ReversedStudentDto(fees.student);
    this.price = fees.price;
  }
}
