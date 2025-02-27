import { Gender } from '@user/enums/gender.enum';
import { UserType } from '@user/enums/user-type.enum';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UsersQueryDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }) => value === 'true')
  pending?: boolean;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(UserType)
  type?: UserType;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }) => value === 'true')
  forgot_pass?: boolean;

  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }) => value === 'true')
  committed?: boolean;
}
