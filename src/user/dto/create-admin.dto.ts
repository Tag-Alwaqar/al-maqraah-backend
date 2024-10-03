import { OmitType } from '@nestjs/mapped-types';
import { SignupDto } from '@user/authentication/dtos/signup.dto';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateAdminDto extends OmitType(SignupDto, [
  'user_type',
  'current_surah',
  'current_ayah',
]) {
  @IsNotEmpty()
  @IsBoolean()
  is_super: boolean;
}
