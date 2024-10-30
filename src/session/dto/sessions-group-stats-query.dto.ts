import { Transform } from 'class-transformer';
import { IsDate, IsOptional, IsString, Matches } from 'class-validator';

export class SessionsGroupStatsQueryDto {
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}$/, {
    message: 'Month must be in the format of year-month',
  })
  month?: string;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  from?: Date;

  @IsOptional()
  @Transform(({ value }) => {
    const date = new Date(value);
    date.setHours(23, 59, 59, 999);
    return date;
  })
  @IsDate()
  to?: Date;
}
