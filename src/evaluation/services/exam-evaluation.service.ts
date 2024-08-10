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
import { ExamEvaluation } from '@evaluation/entities/exam-evaluation.entity';
import { CreateExamEvaluationDto } from '@evaluation/dto/exam-evaluation/create-exam-evaluation.dto';
import { ExamEvaluationsQueryDto } from '@evaluation/dto/exam-evaluation/exam-evaluations-query.dto';
import { ExamEvaluationDto } from '@evaluation/dto/exam-evaluation/exam-evaluation.dto';
import { UpdateExamEvaluationDto } from '@evaluation/dto/exam-evaluation/update-exam-evaluation.dto';

@Injectable()
export class ExamEvaluationsService {
  constructor(
    @InjectRepository(ExamEvaluation)
    private readonly examEvaluationsRepository: Repository<ExamEvaluation>,
    private readonly paginationService: PaginationService,
    private readonly groupsService: GroupsService,
    private readonly studentsService: StudentsService,
    private readonly usersService: UsersService,
  ) {}

  async create(data: CreateExamEvaluationDto) {
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

    const examEvaluation = this.examEvaluationsRepository.create({
      ...rest,
      student,
      group,
    });
    return await this.examEvaluationsRepository.save(examEvaluation);
  }

  async findAll(
    pageOptionsDto: PageOptionsDto,
    examEvaluationsQuery: ExamEvaluationsQueryDto,
    callingUserId: number,
  ) {
    const callingUser = await this.usersService.findOneById(callingUserId);

    if (!callingUser) {
      throw new NotFoundException('هذا المستخدم غير موجود');
    }

    const query = this.examEvaluationsRepository
      .createQueryBuilder('examEvaluation')
      .leftJoinAndSelect('examEvaluation.group', 'group')
      .leftJoinAndSelect('examEvaluation.student', 'student')
      .leftJoinAndSelect('student.user', 'studentUser');

    if (isDefined(examEvaluationsQuery.search))
      query.andWhere('examEvaluation.name LIKE :search', {
        search: `%${examEvaluationsQuery.search}%`,
      });

    if (isDefined(examEvaluationsQuery.group_id))
      query.andWhere('group.id = :group_id', {
        group_id: examEvaluationsQuery.group_id,
      });

    if (isDefined(examEvaluationsQuery.student_id))
      query.andWhere('student.id = :student_id', {
        student_id: examEvaluationsQuery.student_id,
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

    query.orderBy('examEvaluation.created_at', 'DESC');

    return this.paginationService.paginate({
      pageOptionsDto,
      query,
      mapToDto: async (examEvaluations: ExamEvaluation[]) =>
        examEvaluations.map(
          (examEvaluation) => new ExamEvaluationDto(examEvaluation),
        ),
    });
  }

  async findOneById(id: number): Promise<ExamEvaluation | null> {
    return await this.examEvaluationsRepository.findOne({
      where: { id },
      relations: ['group', 'student'],
    });
  }

  async findById(id: number, callingUserId: number): Promise<ExamEvaluation> {
    const examEvaluation = await this.findOneById(id);

    if (!examEvaluation) {
      throw new NotFoundException('هذا التقييم غير موجود');
    }

    const callingUser = await this.usersService.findOneById(callingUserId);

    if (!callingUser) {
      throw new NotFoundException('هذا المستخدم غير موجود');
    }

    if (
      callingUser.teacher &&
      callingUser.gender !== examEvaluation.group.gender
    ) {
      throw new ForbiddenException('لا يمكنك الوصول إلى هذا التقييم');
    }

    if (callingUser.student) {
      const student = await this.studentsService.findOneById(
        callingUser.student.id,
      );

      if (
        !student.groups.find((group) => group.id === examEvaluation.group.id)
      ) {
        throw new ForbiddenException('لا يمكنك الوصول إلى هذا التقييم');
      }
    }

    return examEvaluation;
  }

  async update(examEvaluation: ExamEvaluation) {
    return await this.examEvaluationsRepository.save(examEvaluation);
  }

  async updateExamEvaluation(id: number, data: UpdateExamEvaluationDto) {
    const examEvaluation = await this.findOneById(id);

    if (!examEvaluation) {
      throw new NotFoundException('هذا التقييم غير موجود');
    }

    Object.keys(data).forEach((key) => {
      if (isDefined(data[key])) {
        examEvaluation[key] = data[key];
      }
    });

    return await this.update(examEvaluation);
  }

  async delete(id: number) {
    const examEvaluation = await this.examEvaluationsRepository.findOne({
      where: { id },
    });

    if (!examEvaluation) {
      throw new NotFoundException('هذا التقييم غير موجود');
    }

    await this.examEvaluationsRepository.delete(id);
  }
}
