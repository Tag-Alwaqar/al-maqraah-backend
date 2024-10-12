import { WeekdayEnum } from '@common/enums/weekday.enum';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsMilitaryTime,
  IsNotEmpty,
} from 'class-validator';

export class CreateGroupAppointmentDto {
  @ArrayMinSize(1)
  @IsArray()
  @IsEnum(WeekdayEnum, { each: true })
  weekdays: WeekdayEnum[];

  @IsNotEmpty()
  @IsMilitaryTime()
  start_time: string;

  @IsNotEmpty()
  @IsMilitaryTime()
  end_time: string;
}
