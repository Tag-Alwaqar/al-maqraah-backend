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
import { UsersService } from '@user/services/user.service';
import { QuraanExamEvaluation } from '@evaluation/entities/quraan-exam-evaluation.entity';
import { CreateQuraanExamEvaluationDto } from '@evaluation/dto/quraan-exam-evaluation/create-quraan-exam-evaluation.dto';
import { QuraanExamEvaluationsQueryDto } from '@evaluation/dto/quraan-exam-evaluation/quraan-exam-evaluations-query.dto';
import { QuraanExamEvaluationDto } from '@evaluation/dto/quraan-exam-evaluation/quraan-exam-evaluation.dto';
import { UpdateQuraanExamEvaluationDto } from '@evaluation/dto/quraan-exam-evaluation/update-quraan-exam-evaluation.dto';

@Injectable()
export class QuraanExamEvaluationsService {
  constructor(
    @InjectRepository(QuraanExamEvaluation)
    private readonly quraanExamEvaluationsRepository: Repository<QuraanExamEvaluation>,
    private readonly paginationService: PaginationService,
    private readonly groupsService: GroupsService,
    private readonly studentsService: StudentsService,
    private readonly usersService: UsersService,
  ) {}

  async create(data: CreateQuraanExamEvaluationDto) {
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

    const quraanExamEvaluation = this.quraanExamEvaluationsRepository.create({
      ...rest,
      student,
      group,
    });
    return await this.quraanExamEvaluationsRepository.save(
      quraanExamEvaluation,
    );
  }

  async findAll(
    pageOptionsDto: PageOptionsDto,
    quraanExamEvaluationsQuery: QuraanExamEvaluationsQueryDto,
    callingUserId: number,
  ) {
    const callingUser = await this.usersService.findOneById(callingUserId);

    if (!callingUser) {
      throw new NotFoundException('هذا المستخدم غير موجود');
    }

    const query = this.quraanExamEvaluationsRepository
      .createQueryBuilder('quraanExamEvaluation')
      .leftJoinAndSelect('quraanExamEvaluation.group', 'group')
      .leftJoinAndSelect('quraanExamEvaluation.student', 'student')
      .leftJoinAndSelect('student.user', 'studentUser');

    if (isDefined(quraanExamEvaluationsQuery.search))
      query.andWhere('quraanExamEvaluation.name ILIKE :search', {
        search: `%${quraanExamEvaluationsQuery.search}%`,
      });

    if (isDefined(quraanExamEvaluationsQuery.group_id))
      query.andWhere('group.id = :group_id', {
        group_id: quraanExamEvaluationsQuery.group_id,
      });

    if (isDefined(quraanExamEvaluationsQuery.student_id))
      query.andWhere('student.id = :student_id', {
        student_id: quraanExamEvaluationsQuery.student_id,
      });

    if (isDefined(quraanExamEvaluationsQuery.month)) {
      const year = quraanExamEvaluationsQuery.month.split('-')[0];
      const month = quraanExamEvaluationsQuery.month.split('-')[1];

      query.andWhere(
        'EXTRACT(YEAR FROM quraanExamEvaluation.created_at) = :year',
        {
          year,
        },
      );

      query.andWhere(
        'EXTRACT(MONTH FROM quraanExamEvaluation.created_at) = :month',
        {
          month,
        },
      );
    }

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

    query.orderBy('quraanExamEvaluation.created_at', 'DESC');

    return this.paginationService.paginate({
      pageOptionsDto,
      query,
      mapToDto: async (quraanExamEvaluations: QuraanExamEvaluation[]) =>
        quraanExamEvaluations.map(
          (quraanExamEvaluation) =>
            new QuraanExamEvaluationDto(quraanExamEvaluation),
        ),
    });
  }

  async findOneById(id: number): Promise<QuraanExamEvaluation | null> {
    return await this.quraanExamEvaluationsRepository.findOne({
      where: { id },
      relations: ['group', 'student'],
    });
  }

  async findById(
    id: number,
    callingUserId: number,
  ): Promise<QuraanExamEvaluation> {
    const quraanExamEvaluation = await this.findOneById(id);

    if (!quraanExamEvaluation) {
      throw new NotFoundException('هذا التقييم غير موجود');
    }

    const callingUser = await this.usersService.findOneById(callingUserId);

    if (!callingUser) {
      throw new NotFoundException('هذا المستخدم غير موجود');
    }

    if (
      callingUser.teacher &&
      callingUser.gender !== quraanExamEvaluation.group.gender
    ) {
      throw new ForbiddenException('لا يمكنك الوصول إلى هذا التقييم');
    }

    if (callingUser.student) {
      const student = await this.studentsService.findOneById(
        callingUser.student.id,
      );

      if (
        !student.groups.find(
          (group) => group.id === quraanExamEvaluation.group.id,
        )
      ) {
        throw new ForbiddenException('لا يمكنك الوصول إلى هذا التقييم');
      }
    }

    return quraanExamEvaluation;
  }

  async update(quraanExamEvaluation: QuraanExamEvaluation) {
    return await this.quraanExamEvaluationsRepository.save(
      quraanExamEvaluation,
    );
  }

  async updateQuraanExamEvaluation(
    id: number,
    data: UpdateQuraanExamEvaluationDto,
  ) {
    const quraanExamEvaluation = await this.findOneById(id);

    if (!quraanExamEvaluation) {
      throw new NotFoundException('هذا التقييم غير موجود');
    }

    Object.keys(data).forEach((key) => {
      if (isDefined(data[key])) {
        quraanExamEvaluation[key] = data[key];
      }
    });

    return await this.update(quraanExamEvaluation);
  }

  async delete(id: number) {
    const quraanExamEvaluation =
      await this.quraanExamEvaluationsRepository.findOne({
        where: { id },
      });

    if (!quraanExamEvaluation) {
      throw new NotFoundException('هذا التقييم غير موجود');
    }

    await this.quraanExamEvaluationsRepository.delete(id);
  }
}
