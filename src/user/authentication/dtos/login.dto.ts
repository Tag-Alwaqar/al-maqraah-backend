import { User } from '@user/entities/user.entity';
import { UserInfo } from './user-info.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { UserDto } from '@user/dto/user.dto';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
