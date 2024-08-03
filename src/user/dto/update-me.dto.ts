import { OmitType } from '@nestjs/mapped-types';
import { UpdateUserDto } from './update-user.dto';

export class UpdateMeDto extends OmitType(UpdateUserDto, ['gender']) {} // Don't allow to update gender
