import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from '@user/entities/admin.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { StudentsService } from './student.service';
import { GroupsService } from '@group/services/group.service';
import {
  AssignStudentToGroupDto,
  RemoveStudentFromGroupDto,
} from '@user/dto/assign-student-to-group.dto';
import { UsersService } from './user.service';
import { CreateAdminDto } from '@user/dto/create-admin.dto';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminsRepository: Repository<Admin>,
    private readonly studentsService: StudentsService,
    private readonly groupsService: GroupsService,
    private readonly usersService: UsersService,
  ) {}

  async findOne(options: FindOptionsWhere<Admin>): Promise<Admin | null> {
    return await this.adminsRepository.findOne({
      where: options,
    });
  }

  async create(dto: CreateAdminDto, callingUserId: number) {
    const currentAdmin = await this.adminsRepository.findOne({
      where: { user_id: callingUserId },
    });

    if (!currentAdmin.is_super)
      throw new ForbiddenException('لا يمكنك إنشاء حساب مشرف');

    const user = await this.usersService.signup(dto, true);

    const admin = this.adminsRepository.create({
      user_id: user.id,
      is_super: dto.is_super,
    });
    await this.adminsRepository.save(admin);

    console.log('adminnn', admin);

    user.admin = admin;
    await this.usersService.update(user);

    console.log('userrr', user);
  }

  async findOneById(id: number): Promise<Admin | null> {
    return await this.adminsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async assignStudentToGroup(data: AssignStudentToGroupDto) {
    const student = await this.studentsService.findOneById(data.student_id);
    if (!student) {
      throw new NotFoundException('الطالب غير موجود');
    }

    const group = await this.groupsService.findOneById(data.group_id);
    if (!group) {
      throw new NotFoundException('المجموعة غير موجودة');
    }

    // student can join only groups of the same gender
    if (group.gender !== student.user.gender)
      throw new ForbiddenException(
        'لا يمكن للطالب الانضمام لمجموعة ذات جنس مختلف',
      );

    const studentGroups = student.groups;

    // student can join only two groups
    if (studentGroups.length >= 2)
      throw new ForbiddenException(
        'لا يمكن للطالب الانضمام إلى أكثر من مجموعتين',
      );

    if (studentGroups.some((studentGroup) => studentGroup.id === group.id))
      throw new ForbiddenException('الطالب موجود بالفعل في هذه المجموعة');

    // student can join only one group of each type
    let canJoin = {
      quraan: true,
      sharia: true,
    };

    studentGroups.forEach((studentGroup) => {
      canJoin[studentGroup.type] = false;
    });

    if (!canJoin[group.type])
      throw new ForbiddenException(
        'لا يستطيع الطالب الانضمام لهذه المجموعة لأنه ينتمي لمجموعة أخرى من نفس النوع',
      );

    student.groups.push(group);

    await this.studentsService.update(student);
  }

  async removeStudentFromGroup(data: RemoveStudentFromGroupDto) {
    const student = await this.studentsService.findOneById(data.student_id);
    if (!student) {
      throw new NotFoundException('الطالب غير موجود');
    }

    const group = await this.groupsService.findOneById(data.group_id);
    if (!group) {
      throw new NotFoundException('المجموعة غير موجودة');
    }

    // check if the student is in the group
    if (!student.groups.some((studentGroup) => studentGroup.id === group.id))
      throw new ForbiddenException('الطالب ليس في هذه المجموعة');

    // remove the group from the student
    student.groups = student.groups.filter(
      (studentGroup) => studentGroup.id !== group.id,
    );

    await this.studentsService.update(student);
  }
}
