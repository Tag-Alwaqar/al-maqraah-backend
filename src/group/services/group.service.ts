import { PageOptionsDto } from '@common/dtos/page-option.dto';
import { PaginationService } from '@common/pagination.service';
import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { isDefined } from 'class-validator';
import { Group } from '../entities/group.entity';
import { CreateGroupDto } from '@group/dto/create-group.dto';
import { GroupsQueryDto } from '@group/dto/groups-query.dto';
import { GroupDto } from '@group/dto/group.dto';
import { UpdateGroupDto } from '@group/dto/update-group.dto';
import { UsersService } from '@user/services/user.service';
import { StudentsService } from '@user/services/student.service';
import { CreateGroupAppointmentDto } from '@group/dto/create-group-appointment.dto';
import { GroupAppointment } from '@group/entities/group-appointment.entity';
import { AppointmentsQueryDto } from '@group/dto/appointments-query.dto';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupsRepository: Repository<Group>,
    @InjectRepository(GroupAppointment)
    private readonly groupAppointmentsRepository: Repository<GroupAppointment>,
    private readonly paginationService: PaginationService,
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => StudentsService))
    private readonly studentsService: StudentsService,
  ) {}

  async create(data: CreateGroupDto, adminId: number) {
    const existingNameGroup = await this.groupsRepository.findOne({
      where: { name: data.name },
    });
    if (existingNameGroup) {
      throw new ConflictException('هذا الإسم موجود بالفعل');
    }

    const group = this.groupsRepository.create({
      ...data,
      admin_id: adminId,
    });
    return await this.groupsRepository.save(group);
  }

  async addGroupAppointment(groupId: number, dto: CreateGroupAppointmentDto) {
    const { weekdays, ...rest } = dto;

    const group = await this.findOneById(groupId);

    if (!group) {
      throw new NotFoundException('هذه المجموعة غير موجودة');
    }

    for (const weekday of weekdays) {
      const appointment = this.groupAppointmentsRepository.create({
        ...rest,
        weekday,
        group,
      });

      await this.groupAppointmentsRepository.save(appointment);
    }

    return await this.findOneById(groupId);
  }

  async removeGroupAppointment(groupId: number, appointmentId: number) {
    const group = await this.findOneById(groupId);

    if (!group) {
      throw new NotFoundException('هذه المجموعة غير موجودة');
    }

    const appointment = await this.groupAppointmentsRepository.findOne({
      where: { id: appointmentId, group_id: groupId },
    });

    if (!appointment) {
      throw new NotFoundException('هذا الموعد غير موجود');
    }

    await this.groupAppointmentsRepository.delete(appointmentId);

    return await this.findOneById(groupId);
  }

  async findAll(
    pageOptionsDto: PageOptionsDto,
    groupsQuery: GroupsQueryDto,
    callingUserId: number,
  ) {
    const callingUser = await this.usersService.findOneById(callingUserId);

    if (!callingUser) {
      throw new NotFoundException('هذا المستخدم غير موجود');
    }

    const query = this.groupsRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.admin', 'admin');

    if (isDefined(groupsQuery.search))
      query.andWhere('group.name ILIKE :search', {
        search: `%${groupsQuery.search}%`,
      });

    if (isDefined(groupsQuery.type))
      query.andWhere('group.type = :type', { type: groupsQuery.type });

    if (isDefined(groupsQuery.gender) && callingUser.admin)
      query.andWhere('group.gender = :gender', { gender: groupsQuery.gender });

    if (callingUser.teacher)
      query.andWhere('group.gender = :gender', { gender: callingUser.gender });

    if (callingUser.student) {
      const student = await this.studentsService.findOneById(
        callingUser.student.id,
      );

      const studentGroupsIds = student.groups.map((group) => group.id);

      if (studentGroupsIds.length === 0) {
        throw new NotFoundException('لا يوجد لديك مجموعات');
      }

      query.andWhere('group.id IN (:...ids)', {
        ids: studentGroupsIds,
      });
    }

    query.orderBy('group.name', 'ASC').addOrderBy('group.created_at', 'DESC');

    return this.paginationService.paginate({
      pageOptionsDto,
      query,
      mapToDto: async (groups: Group[]) =>
        groups.map((group) => new GroupDto(group)),
    });
  }

  async getAppointments(queryDto: AppointmentsQueryDto, callingUserId: number) {
    const callingUser = await this.usersService.findOneById(callingUserId);

    if (!callingUser) {
      throw new NotFoundException('هذا المستخدم غير موجود');
    }
    const query = this.groupAppointmentsRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.group', 'group');

    if (isDefined(queryDto.type))
      query.andWhere('group.type = :type', { type: queryDto.type });

    if (isDefined(queryDto.gender))
      query.andWhere('group.gender = :gender', { gender: queryDto.gender });

    if (isDefined(queryDto.group_id))
      query.andWhere('group.id = :group_id', { group_id: queryDto.group_id });

    if (callingUser.teacher)
      query.andWhere('group.gender = :gender', { gender: callingUser.gender });

    if (callingUser.student) {
      const student = await this.studentsService.findOneById(
        callingUser.student.id,
      );

      const studentGroupsIds = student.groups.map((group) => group.id);

      if (studentGroupsIds.length === 0) {
        throw new NotFoundException('لا يوجد لديك مجموعات');
      }

      query.andWhere('group.id IN (:...ids)', {
        ids: studentGroupsIds,
      });
    }

    return await query.getMany();
  }

  async findOneById(id: number): Promise<Group | null> {
    return await this.groupsRepository.findOne({
      where: { id },
    });
  }

  async findById(id: number, callingUserId: number): Promise<Group> {
    const group = await this.findOneById(id);

    if (!group) {
      throw new NotFoundException('هذه المجموعة غير موجودة');
    }

    const callingUser = await this.usersService.findOneById(callingUserId);

    if (!callingUser) {
      throw new NotFoundException('هذا المستخدم غير موجود');
    }

    if (callingUser.teacher && callingUser.gender !== group.gender) {
      throw new ForbiddenException('لا يمكنك الوصول إلى هذه المجموعة');
    }

    if (callingUser.student) {
      const student = await this.studentsService.findOneById(
        callingUser.student.id,
      );

      if (!student.groups.find((group) => group.id === id)) {
        throw new ForbiddenException('لا يمكنك الوصول إلى هذه المجموعة');
      }
    }

    return group;
  }

  async update(group: Group) {
    return await this.groupsRepository.save(group);
  }

  async updateGroup(id: number, data: UpdateGroupDto) {
    const group = await this.findOneById(id);

    if (!group) {
      throw new NotFoundException('هذه المجموعة غير موجودة');
    }

    const { name, ...rest } = data;

    if (isDefined(name)) {
      const existingNameGroup = await this.groupsRepository.findOne({
        where: { name, id: Not(id) },
      });
      if (existingNameGroup) {
        throw new ConflictException('هذا الإسم موجود بالفعل');
      }

      group.name = name;
    }

    Object.keys(rest).forEach((key) => {
      if (isDefined(rest[key])) {
        group[key] = rest[key];
      }
    });

    return await this.update(group);
  }

  async delete(id: number) {
    const group = await this.groupsRepository.findOne({
      where: { id },
    });

    if (!group) {
      throw new NotFoundException('هذه المجموعة غير موجودة');
    }

    await this.groupsRepository.delete(id);
  }
}
