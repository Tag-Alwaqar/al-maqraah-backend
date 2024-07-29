import { User } from '@user/entities/user.entity';
import { Gender } from '@user/enums/gender.enum';

export class UserInfo {
  id: number;
  code: string;
  name: string;
  phone: string;
  gender: Gender;
  born_at: Date;
  approved: boolean;

  constructor(user: User) {
    this.id = user.id;
    this.code = user.code;
    this.name = user.name;
    this.phone = user.phone;
    this.gender = user.gender;
    this.born_at = user.born_at;
    this.approved = user.approved;
  }
}
