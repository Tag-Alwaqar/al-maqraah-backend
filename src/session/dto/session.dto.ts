import { GroupDto } from '@group/dto/group.dto';
import { ReversedTeacherDto } from '@user/dto/user.dto';
import { Session } from '../entities/session.entity';

export class SessionDto {
  id: number;
  created_at: Date;
  updated_at: Date;
  group_id: number;
  group: GroupDto;
  teacher_id: number;
  teacher: ReversedTeacherDto;
  duration: number;
  constructor(session: Session) {
    this.id = session.id;
    this.created_at = session.created_at;
    this.updated_at = session.updated_at;
    if (session.group) this.group = new GroupDto(session.group);
    else this.group_id = session.group_id;
    if (session.teacher) this.teacher = new ReversedTeacherDto(session.teacher);
    else this.teacher_id = session.teacher_id;
    this.duration = session.duration;
  }
}
