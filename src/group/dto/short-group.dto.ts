import { GroupType } from '@group/enums/group-type.enum';
import { Group } from '@group/entities/group.entity';
import { Gender } from '@user/enums/gender.enum';

export class ShortGroupDto {
  id: number;
  created_at: Date;
  updated_at: Date;
  name: string;
  type: GroupType;
  gender: Gender;
  constructor(group: Group) {
    this.id = group.id;
    this.created_at = group.created_at;
    this.updated_at = group.updated_at;
    this.name = group.name;
    this.type = group.type;
    this.gender = group.gender;
  }
}
