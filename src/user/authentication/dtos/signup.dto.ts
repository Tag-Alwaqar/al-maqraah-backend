import { UserDto } from '@user/dto/user.dto';
import { Gender } from '@user/enums/gender.enum';
import { UserType } from '@user/enums/user-type.enum';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  IsInt,
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
  @IsInt()
  @Min(1)
  @Max(114)
  current_surah?: number;

  @IsOptional()
  @IsInt()
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
