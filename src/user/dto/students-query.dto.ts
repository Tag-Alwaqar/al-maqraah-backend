import { GroupType } from '@group/enums/group-type.enum';
import { OmitType } from '@nestjs/mapped-types';
import { Gender } from '@user/enums/gender.enum';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class NotAssignedStudentsQueryDto {
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

export class StudentsQueryDto extends OmitType(NotAssignedStudentsQueryDto, [
  'groupType',
]) {}
