import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateFeesDto {
  @IsNotEmpty()
  @IsInt()
  group_id: number;

  @IsNotEmpty()
  @IsInt()
  student_id: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  month: string;
}
