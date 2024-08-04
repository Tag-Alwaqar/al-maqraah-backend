import { Group } from '@group/entities/group.entity';
import { GroupType } from '@group/enums/group-type.enum';
import { PartialType } from '@nestjs/swagger';
import { Gender } from '@user/enums/gender.enum';

class GroupSeed extends PartialType(Group) {}

export const groups: GroupSeed[] = [
  {
    name: 'المجموعة الأولى',
    gender: Gender.Male,
    type: GroupType.Quraan,
  },
  {
    name: 'المجموعة الثانية',
    gender: Gender.Male,
    type: GroupType.Sharia,
  },
  {
    name: 'المجموعة الثالثة',
    gender: Gender.Female,
    type: GroupType.Quraan,
  },
  {
    name: 'المجموعة الرابعة',
    gender: Gender.Female,
    type: GroupType.Sharia,
  },
];
