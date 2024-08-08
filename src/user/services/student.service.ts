import { PageOptionsDto } from '@common/dtos/page-option.dto';
import { GroupsService } from '@group/services/group.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignupDto } from '@user/authentication/dtos/signup.dto';
import { UpdateStudentDto } from '@user/dto/update-student.dto';
import { Student } from '@user/entities/student.entity';
import { isDefined } from 'class-validator';
import { Repository } from 'typeorm';
import { UsersService } from './user.service';
import { PaginationService } from '@common/pagination.service';
import { ReverseStudentDto } from '@user/dto/user.dto';
import { StudentsQueryDto } from '@user/dto/students-query.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
    private readonly groupsService: GroupsService,
    private readonly usersService: UsersService,
    private readonly paginationService: PaginationService,
  ) {}

  async signup(userId: number, data: SignupDto) {
    const student = this.studentsRepository.create({
      user_id: userId,
      current_surah: data.current_surah,
      current_ayah: data.current_ayah,
    });
    return await this.studentsRepository.save(student);
  }

  async getGroupStudents(
    pageOptionsDto: PageOptionsDto,
    groupId: number,
    callingUserId: number,
  ) {
    const group = await this.groupsService.findOneById(groupId);

    if (!group) {
      throw new NotFoundException('هذه المجموعة غير موجودة');
    }

    const callingUser = await this.usersService.findOneById(callingUserId);

    if (!callingUser) {
      throw new NotFoundException('هذا المستخدم غير موجود');
    }

    if (callingUser.teacher && callingUser.gender !== group.gender)
      throw new NotFoundException('لا يمكنك الوصول إلى هذه المجموعة');

    if (callingUser.student) {
      const student = await this.studentsRepository.findOne({
        where: { user_id: callingUserId },
        relations: ['groups'],
      });

      if (!student.groups.find((group) => group.id === groupId)) {
        throw new NotFoundException('لا يمكنك الوصول إلى هذه المجموعة');
      }
    }

    const query = this.studentsRepository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.user', 'user')
      .leftJoinAndSelect('student.groups', 'group')
      .where('group.id = :groupId', { groupId });

    query.orderBy('user.name', 'ASC');

    return this.paginationService.paginate({
      pageOptionsDto,
      query,
      mapToDto: async (student: Student[]) =>
        student.map((student) => new ReverseStudentDto(student)),
    });
  }

  async getNotAssignedStudents(
    pageOptionsDto: PageOptionsDto,
    studentsQueryDto: StudentsQueryDto,
  ) {
    const subQuery = this.studentsRepository
      .createQueryBuilder('student')
      .select('student.id')
      .leftJoin('student.groups', 'group')
      .where('group.type = :type', { type: studentsQueryDto.groupType });

    const query = this.studentsRepository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.user', 'user')
      .leftJoinAndSelect('student.groups', 'group')
      .where(`student.id NOT IN (${subQuery.getQuery()})`)
      .setParameters(subQuery.getParameters());

    if (studentsQueryDto.gender)
      query.andWhere('user.gender = :gender', {
        gender: studentsQueryDto.gender,
      });

    if (studentsQueryDto.search)
      query.andWhere('user.name LIKE :search', {
        search: `%${studentsQueryDto.search}%`,
      });

    query.orderBy('user.name', 'ASC');

    return this.paginationService.paginate({
      pageOptionsDto,
      query,
      mapToDto: async (student: Student[]) =>
        student.map((student) => new ReverseStudentDto(student)),
    });
  }

  async findOneById(id: number): Promise<Student | null> {
    return await this.studentsRepository.findOne({
      where: { id },
      relations: ['user', 'groups'],
    });
  }

  async update(student: Student) {
    return await this.studentsRepository.save(student);
  }

  async updateStudent(id: number, data: UpdateStudentDto) {
    const student = await this.findOneById(id);

    if (!student) {
      throw new NotFoundException('هذا المستخدم غير موجود');
    }

    Object.keys(data).forEach((key) => {
      if (isDefined(data[key])) {
        student[key] = data[key];
      }
    });

    return await this.update(student);
  }
}
