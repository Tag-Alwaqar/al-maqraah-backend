import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UsersQueryDto {
  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }) => value === 'true')
  pending?: boolean;

  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }) => value === 'true')
  admin?: boolean;

  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }) => value === 'true')
  teacher?: boolean;

  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }) => value === 'true')
  student?: boolean;

  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }) => value === 'true')
  forgot_pass?: boolean;
}
