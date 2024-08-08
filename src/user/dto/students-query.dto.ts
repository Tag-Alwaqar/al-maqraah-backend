import { GroupType } from '@group/enums/group-type.enum';
import { Gender } from '@user/enums/gender.enum';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class StudentsQueryDto {
  @IsNotEmpty()
  @IsEnum(GroupType)
  groupType!: GroupType;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  search?: string;
}
