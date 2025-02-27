import { GroupType } from '@group/enums/group-type.enum';
import { OmitType } from '@nestjs/mapped-types';
import { Gender } from '@user/enums/gender.enum';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class FeesQueryDto {
  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  admin_id?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  group_id?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  student_id?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(GroupType)
  groupType?: GroupType;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  search?: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{4}-\d{2}$/, {
    message: 'Month must be in the format of year-month',
  })
  month?: string;
}

export class NotPaidStudentsQueryDto extends OmitType(FeesQueryDto, [
  'month',
  'admin_id',
  'student_id',
]) {
  @IsNotEmpty()
  @IsString()
  month: string;
}
