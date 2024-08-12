import { GroupDto } from '@group/dto/group.dto';
import { ReversedTeacherDto } from '@user/dto/user.dto';
import { Session } from '../entities/session.entity';

export class SessionDto {
  id: number;
  created_at: Date;
  updated_at: Date;
  group: GroupDto;
  teacher: ReversedTeacherDto;
  duration: number;
  constructor(session: Session) {
    this.id = session.id;
    this.created_at = session.created_at;
    this.updated_at = session.updated_at;
    this.group = new GroupDto(session.group);
    this.teacher = new ReversedTeacherDto(session.teacher);
    this.duration = session.duration;
  }
}
