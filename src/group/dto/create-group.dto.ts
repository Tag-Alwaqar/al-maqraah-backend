import { GroupType } from '@group/enums/group-type.enum';
import { Gender } from '@user/enums/gender.enum';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateGroupDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(GroupType)
  type: GroupType;

  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;
}
