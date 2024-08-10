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
import { EvaluationsQueryDto } from '@evaluation/dto/evaluation/evaluations-query.dto';
import { UsersService } from '@user/services/user.service';
import { ShariaEvaluation } from '@evaluation/entities/sharia-evaluation.entity';
import { CreateShariaEvaluationDto } from '@evaluation/dto/sharia-evaluation/create-sharia-evaluation.dto';
import { ShariaEvaluationDto } from '@evaluation/dto/sharia-evaluation/sharia-evaluation.dto';
import { User } from '@user/entities/user.entity';

@Injectable()
export class ShariaEvaluationsService {
  constructor(
    @InjectRepository(ShariaEvaluation)
    private readonly shariaEvaluationsRepository: Repository<ShariaEvaluation>,
    private readonly paginationService: PaginationService,
    private readonly groupsService: GroupsService,
    private readonly studentsService: StudentsService,
    private readonly usersService: UsersService,
  ) {}

  async create(data: CreateShariaEvaluationDto, teacherUser: User) {
    const { student_id, group_id, ...rest } = data;

    const student = await this.studentsService.findOneById(data.student_id);

    if (!student) throw new NotFoundException('هذا الطالب غير موجود');

    const group = await this.groupsService.findOneById(data.group_id);

    if (!group) throw new NotFoundException('هذه المجموعة غير موجودة');

    if (teacherUser.gender !== group.gender)
      throw new ForbiddenException('لا يمكنك إضافة تقييم لهذه المجموعة');

    if (!student.groups.find((studentGroup) => studentGroup.id === group.id))
      throw new NotFoundException('هذا الطالب ليس في هذه المجموعة');

    const shariaEvaluation = this.shariaEvaluationsRepository.create({
      ...rest,
      teacher: teacherUser.teacher,
      student,
      group,
    });

    return await this.shariaEvaluationsRepository.save(shariaEvaluation);
  }

  async findAll(
    pageOptionsDto: PageOptionsDto,
    evaluationsQuery: EvaluationsQueryDto,
    callingUserId: number,
  ) {
    const callingUser = await this.usersService.findOneById(callingUserId);

    if (!callingUser) {
      throw new NotFoundException('هذا المستخدم غير موجود');
    }

    const query = this.shariaEvaluationsRepository
      .createQueryBuilder('shariaEvaluation')
      .leftJoinAndSelect('shariaEvaluation.group', 'group')
      .leftJoinAndSelect('shariaEvaluation.student', 'student')
      .leftJoinAndSelect('student.user', 'studentUser')
      .leftJoinAndSelect('shariaEvaluation.teacher', 'teacher')
      .leftJoinAndSelect('teacher.user', 'teacherUser');

    if (isDefined(evaluationsQuery.group_id))
      query.andWhere('group.id = :group_id', {
        group_id: evaluationsQuery.group_id,
      });

    if (isDefined(evaluationsQuery.student_id))
      query.andWhere('student.id = :student_id', {
        student_id: evaluationsQuery.student_id,
      });

    if (isDefined(evaluationsQuery.teacher_id))
      query.andWhere('teacher.id = :teacher_id', {
        teacher_id: evaluationsQuery.teacher_id,
      });

    if (callingUser.teacher)
      query.andWhere('group.gender = :gender', {
        gender: callingUser.gender,
      });

    if (callingUser.student) {
      const student = await this.studentsService.findOneById(
        callingUser.student.id,
      );

      const studentGroupIds = student.groups.map((group) => group.id);

      if (studentGroupIds.length === 0) {
        throw new NotFoundException('لا يوجد لديك مجموعات');
      }

      query.andWhere('group.id IN (:...ids)', {
        ids: studentGroupIds,
      });
    }

    query.orderBy('shariaEvaluation.created_at', 'DESC');

    return this.paginationService.paginate({
      pageOptionsDto,
      query,
      mapToDto: async (shariaEvaluations: ShariaEvaluation[]) =>
        shariaEvaluations.map(
          (shariaEvaluation) => new ShariaEvaluationDto(shariaEvaluation),
        ),
    });
  }

  async findOneById(id: number): Promise<ShariaEvaluation | null> {
    return await this.shariaEvaluationsRepository.findOne({
      where: { id },
      relations: ['group', 'student', 'teacher'],
    });
  }

  async findById(id: number, callingUserId: number): Promise<ShariaEvaluation> {
    const shariaEvaluation = await this.findOneById(id);

    if (!shariaEvaluation) {
      throw new NotFoundException('هذا التقييم غير موجود');
    }

    const callingUser = await this.usersService.findOneById(callingUserId);

    if (!callingUser) {
      throw new NotFoundException('هذا المستخدم غير موجود');
    }

    if (
      callingUser.teacher &&
      callingUser.gender !== shariaEvaluation.group.gender
    ) {
      throw new ForbiddenException('لا يمكنك الوصول إلى هذا التقييم');
    }

    if (callingUser.student) {
      const student = await this.studentsService.findOneById(
        callingUser.student.id,
      );

      if (
        !student.groups.find((group) => group.id === shariaEvaluation.group.id)
      ) {
        throw new ForbiddenException('لا يمكنك الوصول إلى هذا التقييم');
      }
    }

    return shariaEvaluation;
  }

  async delete(id: number, callingUserId: number) {
    const shariaEvaluation = await this.shariaEvaluationsRepository.findOne({
      where: { id },
      relations: ['teacher'],
    });

    if (!shariaEvaluation) {
      throw new NotFoundException('هذا التقييم غير موجود');
    }

    const callingUser = await this.usersService.findOneById(callingUserId);

    if (!callingUser) {
      throw new NotFoundException('هذا المستخدم غير موجود');
    }

    console.log(callingUser.teacher, shariaEvaluation);

    if (
      callingUser.teacher &&
      callingUser.teacher.id !== shariaEvaluation.teacher.id
    ) {
      throw new ForbiddenException('لا يمكنك حذف هذا التقييم');
    }

    if (callingUser.student)
      throw new ForbiddenException('لا يمكنك حذف هذا التقييم');

    await this.shariaEvaluationsRepository.delete(id);
  }
}
