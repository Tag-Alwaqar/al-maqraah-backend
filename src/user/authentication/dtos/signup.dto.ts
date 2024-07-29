import { mapEntityToDto } from '@common/mappers';
import { UserDto } from '@user/dto/user.dto';
import { User } from '@user/entities/user.entity';
import { Gender } from '@user/enums/gender.enum';
import { UserType } from '@user/enums/user-type.enum';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  born_at: Date;

  @IsNotEmpty()
  @IsEnum(UserType)
  user_type: UserType;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(114)
  current_surah?: number;

  @IsOptional()
  @IsNumber()
  current_ayah?: number;
}

export class LoginSignupResponseDto {
  user: UserDto;
  token: string;
  constructor(user: UserDto, token: string) {
    this.user = user;
    this.token = token;
  }
}
