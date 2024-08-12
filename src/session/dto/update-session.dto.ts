import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateSessionDto } from './create-session.dto';

class OmittedCreateSessionDto extends OmitType(CreateSessionDto, [
  'group_id',
]) {}
export class UpdateSessionDto extends PartialType(OmittedCreateSessionDto) {}
