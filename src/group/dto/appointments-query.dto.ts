import { GroupType } from '@group/enums/group-type.enum';
import { Gender } from '@user/enums/gender.enum';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class AppointmentsQueryDto {
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(GroupType)
  type?: GroupType;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  group_id?: number;
}
