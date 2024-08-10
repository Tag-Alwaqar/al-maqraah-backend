import { PartialType } from '@nestjs/mapped-types';
import { CreateFeesDto } from './create-fees.dto';

export class UpdateFeesDto extends PartialType(CreateFeesDto) {}
