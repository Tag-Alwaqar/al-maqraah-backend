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
import { StudentsService } from '@user/services/student.service';
import { GroupsService } from '@group/services/group.service';
import { Fees } from '@fees/entities/fees.entity';
import { CreateFeesDto } from '@fees/dto/create-fees.dto';
import { User } from '@user/entities/user.entity';
import { FeesQueryDto } from '@fees/dto/fees-query.dto';
import { FeesDto } from '@fees/dto/fees.dto';
import { UpdateFeesDto } from '@fees/dto/update-fees.dto';

@Injectable()
export class FeesService {
  constructor(
    @InjectRepository(Fees)
    private readonly feesRepository: Repository<Fees>,
    private readonly paginationService: PaginationService,
    private readonly groupsService: GroupsService,
    private readonly studentsService: StudentsService,
  ) {}

  async create(data: CreateFeesDto, adminUser: User) {
    const { student_id, group_id, ...rest } = data;

    const student = await this.studentsService.findOneById(data.student_id);

    if (!student) {
      throw new NotFoundException('هذا الطالب غير موجود');
    }

    const group = await this.groupsService.findOneById(data.group_id);

    if (!group) {
      throw new NotFoundException('هذه المجموعة غير موجودة');
    }

    if (!student.groups.find((studentGroup) => studentGroup.id === group.id)) {
      throw new NotFoundException('هذا الطالب ليس في هذه المجموعة');
    }

    const fees = this.feesRepository.create({
      ...rest,
      admin: adminUser.admin,
      student,
      group,
    });
    return await this.feesRepository.save(fees);
  }

  async findAll(pageOptionsDto: PageOptionsDto, feesQuery: FeesQueryDto) {
    const query = this.feesRepository
      .createQueryBuilder('fees')
      .leftJoinAndSelect('fees.admin', 'admin')
      .leftJoinAndSelect('admin.user', 'adminUser')
      .leftJoinAndSelect('fees.group', 'group')
      .leftJoinAndSelect('fees.student', 'student')
      .leftJoinAndSelect('student.user', 'studentUser');

    if (isDefined(feesQuery.admin_id))
      query.andWhere('admin.id = :admin_id', {
        admin_id: feesQuery.admin_id,
      });

    if (isDefined(feesQuery.group_id))
      query.andWhere('group.id = :group_id', {
        group_id: feesQuery.group_id,
      });

    if (isDefined(feesQuery.student_id))
      query.andWhere('student.id = :student_id', {
        student_id: feesQuery.student_id,
      });

    if (isDefined(feesQuery.groupType))
      query.andWhere('group.type = :groupType', {
        groupType: feesQuery.groupType,
      });

    if (isDefined(feesQuery.gender))
      query.andWhere('studentUser.gender = :gender', {
        gender: feesQuery.gender,
      });

    if (isDefined(feesQuery.search))
      query.andWhere(
        '(studentUser.name ILIKE :search OR group.name ILIKE :search)',
        {
          search: `%${feesQuery.search}%`,
        },
      );

    if (isDefined(feesQuery.month))
      query.andWhere('fees.month = :month', {
        month: feesQuery.month,
      });

    query.orderBy('fees.created_at', 'DESC');

    return this.paginationService.paginate({
      pageOptionsDto,
      query,
      mapToDto: async (fees: Fees[]) => fees.map((fees) => new FeesDto(fees)),
    });
  }

  async findOneById(id: number): Promise<Fees | null> {
    return await this.feesRepository.findOne({
      where: { id },
      relations: ['admin', 'group', 'student'],
    });
  }

  async findById(id: number): Promise<Fees> {
    const fees = await this.findOneById(id);

    if (!fees) {
      throw new NotFoundException('هذا التقييم غير موجود');
    }

    return fees;
  }

  async update(fees: Fees) {
    return await this.feesRepository.save(fees);
  }

  async updateFees(id: number, data: UpdateFeesDto) {
    const fees = await this.findOneById(id);

    if (!fees) {
      throw new NotFoundException('هذا التقييم غير موجود');
    }

    const { student_id, group_id, ...rest } = data;

    if (isDefined(group_id) && fees.group.id !== group_id) {
      const group = await this.groupsService.findOneById(group_id);

      if (!group) {
        throw new NotFoundException('هذه المجموعة غير موجودة');
      }

      fees.group = group;
    }

    if (isDefined(student_id) && fees.student.id !== student_id) {
      const student = await this.studentsService.findOneById(data.student_id);

      if (!student) {
        throw new NotFoundException('هذا الطالب غير موجود');
      }

      if (
        !student.groups.find(
          (studentGroup) => studentGroup.id === fees.group.id,
        )
      ) {
        throw new NotFoundException('هذا الطالب ليس في هذه المجموعة');
      }
    } else {
      // make sure that current student is in the group
      const student = await this.studentsService.findOneById(fees.student.id);

      if (
        !student.groups.find(
          (studentGroup) => studentGroup.id === fees.group.id,
        )
      ) {
        throw new NotFoundException('هذا الطالب ليس في هذه المجموعة');
      }
    }

    Object.keys(data).forEach((key) => {
      if (isDefined(data[key])) {
        fees[key] = data[key];
      }
    });

    return await this.update(fees);
  }

  async delete(id: number) {
    const fees = await this.feesRepository.findOne({
      where: { id },
    });

    if (!fees) {
      throw new NotFoundException('هذا التقييم غير موجود');
    }

    await this.feesRepository.delete(id);
  }
}
