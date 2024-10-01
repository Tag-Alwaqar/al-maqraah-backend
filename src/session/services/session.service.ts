import { PageOptionsDto } from '@common/dtos/page-option.dto';
import { PaginationService } from '@common/pagination.service';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isDefined } from 'class-validator';
import { GroupsService } from '@group/services/group.service';
import { UsersService } from '@user/services/user.service';
import { Session } from '../entities/session.entity';
import { CreateSessionDto } from '../dto/create-session.dto';
import { SessionsQueryDto } from '../dto/sessions-query.dto';
import { SessionDto } from '../dto/session.dto';
import { UpdateSessionDto } from '../dto/update-session.dto';
import { SessionsStatsQueryDto } from '../dto/sessions-stats-query.dto';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionsRepository: Repository<Session>,
    private readonly paginationService: PaginationService,
    private readonly groupsService: GroupsService,
    private readonly usersService: UsersService,
  ) {}

  async create(data: CreateSessionDto, teacherUserId: number) {
    const teacherUser = await this.usersService.findOneById(teacherUserId);

    const { group_id, ...rest } = data;

    const group = await this.groupsService.findOneById(data.group_id);

    if (!group) {
      throw new NotFoundException('هذه المجموعة غير موجودة');
    }

    if (teacherUser.gender !== group.gender)
      throw new ForbiddenException('لا يمكنك إضافة جلسة لهذه المجموعة');

    const session = this.sessionsRepository.create({
      ...rest,
      teacher: teacherUser.teacher,
      group,
    });
    return await this.sessionsRepository.save(session);
  }

  async findAll(
    pageOptionsDto: PageOptionsDto,
    sessionsQuery: SessionsQueryDto,
    callingUserId: number,
  ) {
    const callingUser = await this.usersService.findOneById(callingUserId);

    if (!callingUser) {
      throw new NotFoundException('هذا المستخدم غير موجود');
    }

    if (callingUser.student)
      throw new ForbiddenException('لا يمكنك الوصول إلى هذه البيانات');

    const query = this.sessionsRepository
      .createQueryBuilder('session')
      .leftJoinAndSelect('session.group', 'group')
      .leftJoinAndSelect('session.teacher', 'teacher')
      .leftJoinAndSelect('teacher.user', 'teacherUser');

    if (isDefined(sessionsQuery.group_id))
      query.andWhere('group.id = :group_id', {
        group_id: sessionsQuery.group_id,
      });

    if (isDefined(sessionsQuery.teacher_id) && callingUser.admin)
      query.andWhere('teacher.id = :teacher_id', {
        teacher_id: sessionsQuery.teacher_id,
      });

    if (callingUser.teacher)
      query.andWhere('teacher.id = :teacher_id', {
        teacher_id: callingUser.teacher.id,
      });

    if (isDefined(sessionsQuery.month)) {
      const year = sessionsQuery.month.split('-')[0];
      const month = sessionsQuery.month.split('-')[1];

      query.andWhere('EXTRACT(YEAR FROM session.created_at) = :year', {
        year,
      });

      query.andWhere('EXTRACT(MONTH FROM session.created_at) = :month', {
        month,
      });
    }

    query.orderBy('session.created_at', 'DESC');

    return this.paginationService.paginate({
      pageOptionsDto,
      query,
      mapToDto: async (sessions: Session[]) =>
        sessions.map((session) => new SessionDto(session)),
    });
  }

  async findOneById(id: number): Promise<Session | null> {
    return await this.sessionsRepository.findOne({
      where: { id },
      relations: ['group', 'teacher'],
    });
  }

  async findById(id: number, callingUserId: number): Promise<Session> {
    const session = await this.findOneById(id);

    if (!session) {
      throw new NotFoundException('هذه الحلقة غير موجودة');
    }

    const callingUser = await this.usersService.findOneById(callingUserId);

    if (!callingUser) {
      throw new NotFoundException('هذا المستخدم غير موجود');
    }

    if (callingUser.student)
      throw new ForbiddenException('لا يمكنك الوصول إلى هذه البيانات');

    if (callingUser.teacher && callingUser.teacher.id !== session.teacher.id)
      throw new ForbiddenException('لا يمكنك الوصول إلى هذه الحلقة');

    return session;
  }

  async stats(callingUserId: number, queryData: SessionsStatsQueryDto) {
    const callingUser = await this.usersService.findOneById(callingUserId);

    if (!callingUser) {
      throw new NotFoundException('هذا المستخدم غير موجود');
    }

    if (callingUser.student)
      throw new ForbiddenException('لا يمكنك الوصول إلى هذه البيانات');

    if (callingUser.teacher && callingUser.teacher.id !== queryData.teacher_id)
      throw new ForbiddenException('لا يمكنك الوصول إلى هذه البيانات');

    const query = this.sessionsRepository.createQueryBuilder('session');

    query.select('SUM(session.duration)', 'total_duration');

    query.where('teacher_id = :teacher_id', {
      teacher_id: queryData.teacher_id,
    });

    if (isDefined(queryData.month)) {
      const year = queryData.month.split('-')[0];
      const month = queryData.month.split('-')[1];

      query.andWhere('EXTRACT(YEAR FROM session.created_at) = :year', {
        year,
      });

      query.andWhere('EXTRACT(MONTH FROM session.created_at) = :month', {
        month,
      });
    }

    if (isDefined(queryData.group_id)) {
      query.andWhere('group_id = :group_id', {
        group_id: queryData.group_id,
      });
    }

    if (isDefined(queryData.from)) {
      query.andWhere('session.created_at >= :from', {
        from: queryData.from,
      });
    }

    if (isDefined(queryData.to)) {
      query.andWhere('session.created_at <= :to', {
        to: queryData.to,
      });
    }

    const result = await query.getRawOne();

    return {
      total_duration: +result.total_duration,
    };
  }

  async update(session: Session) {
    return await this.sessionsRepository.save(session);
  }

  async updateSession(
    id: number,
    data: UpdateSessionDto,
    callingUserId: number,
  ) {
    const session = await this.findOneById(id);

    if (!session) {
      throw new NotFoundException('هذه الحلقة غير موجودة');
    }

    const callingUser = await this.usersService.findOneById(callingUserId);

    if (!callingUser) {
      throw new NotFoundException('هذا المستخدم غير موجود');
    }

    if (callingUser.student)
      throw new ForbiddenException('لا يمكنك الوصول إلى هذه البيانات');

    if (callingUser.teacher && callingUser.teacher.id !== session.teacher.id) {
      throw new ForbiddenException('لا يمكنك الوصول إلى هذه الحلقة');
    }

    Object.keys(data).forEach((key) => {
      if (isDefined(data[key])) {
        session[key] = data[key];
      }
    });

    return await this.update(session);
  }

  async delete(id: number, callingUserId: number) {
    const session = await this.sessionsRepository.findOne({
      where: { id },
    });

    if (!session) {
      throw new NotFoundException('هذه الحلقة غير موجودة');
    }

    const callingUser = await this.usersService.findOneById(callingUserId);

    if (!callingUser) {
      throw new NotFoundException('هذا المستخدم غير موجود');
    }

    if (callingUser.student)
      throw new ForbiddenException('لا يمكنك الوصول إلى هذه البيانات');

    if (callingUser.teacher && callingUser.teacher.id !== session.teacher.id) {
      throw new ForbiddenException('لا يمكنك الوصول إلى هذه الحلقة');
    }

    await this.sessionsRepository.delete(id);
  }
}
