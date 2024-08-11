import { GroupType } from '@group/enums/group-type.enum';
import { Gender } from '@user/enums/gender.enum';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GroupsQueryDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(GroupType)
  type?: GroupType;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(Gender)
  gender?: Gender;
}
