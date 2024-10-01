import { Transform } from 'class-transformer';
import {
  IsDate,
  IsISO8601,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class SessionsStatsQueryDto {
  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  teacher_id: number;

  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}$/, {
    message: 'Month must be in the format of year-month',
  })
  month?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  group_id?: number;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  from?: Date;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  to?: Date;
}
