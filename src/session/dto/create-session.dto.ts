import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateSessionDto {
  @IsNotEmpty()
  @IsInt()
  group_id: number;

  @IsNotEmpty()
  @IsInt()
  duration: number;
}
