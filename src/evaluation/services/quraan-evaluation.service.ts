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
import { QuraanEvaluation } from '@evaluation/entities/quraan-evaluation.entity';
import { StudentsService } from '@user/services/student.service';
import { GroupsService } from '@group/services/group.service';
import { CreateQuraanEvaluationDto } from '@evaluation/dto/quraan-evaluation/create-quraan-evaluation.dto';
import { EvaluationsQueryDto } from '@evaluation/dto/evaluation/evaluations-query.dto';
import { UsersService } from '@user/services/user.service';
import { QuraanEvaluationDto } from '@evaluation/dto/quraan-evaluation/quraan-evaluation.dto';
import { User } from '@user/entities/user.entity';
import { UpdateQuraanEvaluationDto } from '@evaluation/dto/quraan-evaluation/update-quraan-evaluation.dto';

@Injectable()
export class QuraanEvaluationsService {
  constructor(
    @InjectRepository(QuraanEvaluation)
    private readonly quraanEvaluationsRepository: Repository<QuraanEvaluation>,
    private readonly paginationService: PaginationService,
    private readonly groupsService: GroupsService,
    private readonly studentsService: StudentsService,
    private readonly usersService: UsersService,
  ) {}

  async create(data: CreateQuraanEvaluationDto, teacherUserId: number) {
    const teacherUser = await this.usersService.findOneById(teacherUserId);

    const { student_id, group_id, ...rest } = data;

    const student = await this.studentsService.findOneById(data.student_id);

    if (!student) throw new NotFoundException('هذا الطالب غير موجود');

    const group = await this.groupsService.findOneById(data.group_id);

    if (!group) throw new NotFoundException('هذه المجموعة غير موجودة');

    if (teacherUser.gender !== group.gender)
      throw new ForbiddenException('لا يمكنك إضافة تقييم لهذه المجموعة');

    if (!student.groups.find((studentGroup) => studentGroup.id === group.id))
      throw new NotFoundException('هذا الطالب ليس في هذه المجموعة');

    // update student's current surah and ayah
    student.current_surah = data.current_new_surah.surah;
    student.current_ayah = data.current_new_surah.end_ayah;

    await this.studentsService.update(student);

    const quraanEvaluation = this.quraanEvaluationsRepository.create({
      ...rest,
      teacher: teacherUser.teacher,
      student,
      group,
    });
    return await this.quraanEvaluationsRepository.save(quraanEvaluation);
  }

  async update(quraanEvaluation: QuraanEvaluation) {
    return await this.quraanEvaluationsRepository.save(quraanEvaluation);
  }

  async updateQuraanEvaluation(
    id: number,
    data: UpdateQuraanEvaluationDto,
    callingUserId: number,
  ) {
    const quraanEvaluation = await this.findOneById(id);

    if (!quraanEvaluation) {
      throw new NotFoundException('هذا التقييم غير موجودة');
    }

    const callingUser = await this.usersService.findOneById(callingUserId);

    if (!callingUser) {
      throw new NotFoundException('هذا المستخدم غير موجود');
    }

    if (callingUser.student)
      throw new ForbiddenException('لا يمكنك الوصول إلى هذه البيانات');

    if (
      callingUser.teacher &&
      callingUser.teacher.id !== quraanEvaluation.teacher.id
    ) {
      throw new ForbiddenException('لا يمكنك الوصول إلى هذه الجلسة');
    }

    Object.keys(data).forEach((key) => {
      if (isDefined(data[key])) {
        quraanEvaluation[key] = data[key];
      }
    });

    return await this.update(quraanEvaluation);
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

    const query = this.quraanEvaluationsRepository
      .createQueryBuilder('quraanEvaluation')
      .leftJoinAndSelect('quraanEvaluation.group', 'group')
      .leftJoinAndSelect('quraanEvaluation.student', 'student')
      .leftJoinAndSelect('student.user', 'studentUser')
      .leftJoinAndSelect('quraanEvaluation.teacher', 'teacher')
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

    query.orderBy('quraanEvaluation.created_at', 'DESC');

    return this.paginationService.paginate({
      pageOptionsDto,
      query,
      mapToDto: async (quraanEvaluations: QuraanEvaluation[]) =>
        quraanEvaluations.map(
          (quraanEvaluation) => new QuraanEvaluationDto(quraanEvaluation),
        ),
    });
  }

  async findOneById(id: number): Promise<QuraanEvaluation | null> {
    return await this.quraanEvaluationsRepository.findOne({
      where: { id },
      relations: ['group', 'student', 'teacher'],
    });
  }

  async findById(id: number, callingUserId: number): Promise<QuraanEvaluation> {
    const quraanEvaluation = await this.findOneById(id);

    if (!quraanEvaluation) {
      throw new NotFoundException('هذا التقييم غير موجود');
    }

    const callingUser = await this.usersService.findOneById(callingUserId);

    if (!callingUser) {
      throw new NotFoundException('هذا المستخدم غير موجود');
    }

    if (
      callingUser.teacher &&
      callingUser.gender !== quraanEvaluation.group.gender
    ) {
      throw new ForbiddenException('لا يمكنك الوصول إلى هذا التقييم');
    }

    if (callingUser.student) {
      const student = await this.studentsService.findOneById(
        callingUser.student.id,
      );

      if (
        !student.groups.find((group) => group.id === quraanEvaluation.group.id)
      ) {
        throw new ForbiddenException('لا يمكنك الوصول إلى هذا التقييم');
      }
    }

    return quraanEvaluation;
  }

  async delete(id: number, callingUserId: number) {
    const quraanEvaluation = await this.quraanEvaluationsRepository.findOne({
      where: { id },
      relations: ['teacher'],
    });

    if (!quraanEvaluation) {
      throw new NotFoundException('هذا التقييم غير موجود');
    }

    const callingUser = await this.usersService.findOneById(callingUserId);

    if (!callingUser) {
      throw new NotFoundException('هذا المستخدم غير موجود');
    }

    if (
      callingUser.teacher &&
      callingUser.teacher.id !== quraanEvaluation.teacher.id
    ) {
      throw new ForbiddenException('لا يمكنك حذف هذا التقييم');
    }

    if (callingUser.student)
      throw new ForbiddenException('لا يمكنك حذف هذا التقييم');

    await this.quraanEvaluationsRepository.delete(id);
  }
}
