import { PageOptionsDto } from '@common/dtos/page-option.dto';
import { PaginationService } from '@common/pagination.service';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignupDto } from '@user/authentication/dtos/signup.dto';
import { UpdateUserDto } from '@user/dto/update-user.dto';
import { GetUserResponseDto } from '@user/dto/user.dto';
import { User } from '@user/entities/user.entity';
import { generateRandomCode } from '@user/utils/utils';
import { Repository } from 'typeorm';
import { UsersQueryDto } from '../dto/users-query.dto';
import { isDefined } from 'class-validator';
import { UserType } from '@user/enums/user-type.enum';
import { AdminsService } from './admin.service';
import { DateTime } from 'luxon';
import { QuraanEvaluation } from '@evaluation/entities/quraan-evaluation.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly paginationService: PaginationService,
  ) {}

  async signup(data: Omit<SignupDto, 'user_type'>, approved = false) {
    let code: string = null;
    while (true) {
      code = generateRandomCode();
      const user = await this.usersRepository.findOne({ where: { code } });
      if (!user) {
        break;
      }
    }
    const user = this.usersRepository.create({
      code,
      password: data.password,
      name: data.name,
      phone: data.phone,
      gender: data.gender,
      born_at: data.born_at,
      approved,
    });
    return await this.usersRepository.save(user);
  }

  async findAll(
    pageOptionsDto: PageOptionsDto,
    usersQuery: UsersQueryDto,
    callingAdminId: number,
  ) {
    const query = this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.admin', 'admin')
      .leftJoinAndSelect('user.teacher', 'teacher')
      .leftJoinAndSelect('user.student', 'student');

    const admin = await this.usersRepository.findOne({
      where: { id: callingAdminId },
      relations: ['admin'],
    });

    if (!admin.admin.is_super) {
      query.andWhere('user.admin IS NULL');
    }

    if (isDefined(usersQuery.type)) {
      if (usersQuery.type === UserType.Admin) {
        if (admin.admin.is_super) query.andWhere('user.admin IS NOT NULL');
        else throw new ForbiddenException('غير مصرح لك بالوصول إلى المشرفين');
      } else query.andWhere(`user.${usersQuery.type} IS NOT NULL`);
    }

    if (isDefined(usersQuery.pending))
      query.andWhere('user.approved = :approved', {
        approved: !usersQuery.pending,
      });

    if (usersQuery.forgot_pass === true) {
      query.andWhere('user.forget_pass_token IS NOT NULL');
    } else if (usersQuery.forgot_pass === false) {
      query.andWhere('user.forget_pass_token IS NULL');
    }

    if (isDefined(usersQuery.gender))
      query.andWhere('user.gender = :gender', {
        gender: usersQuery.gender,
      });

    if (isDefined(usersQuery.search)) {
      query.andWhere('user.name ILIKE :search', {
        search: `%${usersQuery.search}%`,
      });
    }

    if (isDefined(usersQuery.committed)) {
      const oneMonthAgo = DateTime.now().minus({ months: 1 }).toJSDate();

      query.andWhere(
        (qb) => {
          const subquery = qb
            .subQuery()
            .select('MAX(qe.created_at)', 'latest')
            .from(QuraanEvaluation, 'qe')
            .where('qe.student_id = student.id')
            .getQuery();

          return usersQuery.committed
            ? `(${subquery}) > :oneMonthAgo`
            : `(${subquery}) <= :oneMonthAgo`;
        },
        { oneMonthAgo },
      );
    }

    query.orderBy('user.name', 'ASC').addOrderBy('user.created_at', 'DESC');

    return this.paginationService.paginate({
      pageOptionsDto,
      query,
      mapToDto: async (users: User[]) =>
        users.map((user) => new GetUserResponseDto(user)),
    });
  }

  async findById(id: number, callingUserId: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['admin', 'teacher', 'student', 'student.groups'],
    });

    if (!user) {
      throw new NotFoundException('هذا المستخدم غير موجود');
    }

    const callingUser = await this.usersRepository.findOne({
      where: { id: callingUserId },
      relations: ['admin', 'teacher', 'student', 'student.groups'],
    });

    if (!callingUser) {
      throw new NotFoundException('هذا المستخدم غير موجود');
    }

    if (callingUser.id === user.id) return user;

    // admin could see all users
    if (callingUser.admin) return user;

    // teacher could see only students and teachers with the same gender
    if (
      callingUser.teacher &&
      (user.teacher || user.student) &&
      user.gender === callingUser.gender
    )
      return user;

    if (callingUser.student && user.student) {
      // student could see only students that are in the same group
      const callingUserGroupIds = callingUser.student.groups.map(
        (group) => group.id,
      );

      const userGroupIds = user.student.groups.map((group) => group.id);

      const intersection = callingUserGroupIds.filter((id) =>
        userGroupIds.includes(id),
      );

      if (intersection.length > 0) return user;
    }

    throw new ForbiddenException('غير مصرح لك بالوصول إلى هذا المستخدم');
  }

  async findOneById(id: number): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { id },
      relations: ['admin', 'teacher', 'student', 'student.groups'],
    });
  }

  async findOneByIdAndToken(id: number, token: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { id, forget_pass_token: token },
    });
  }

  async findOneByCodeWithPassword(code: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { code },
      select: [
        'id',
        'code',
        'password', // specify select list to select password
        'previous_password',
        'name',
        'phone',
        'approved',
        'born_at',
        'gender',
        'forget_pass_token',
        'created_at',
        'updated_at',
      ],
    });
  }

  async findOneByIdWithPassword(id: number): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { id },
      select: [
        'id',
        'code',
        'password', // specify select list to select password
        'name',
        'phone',
        'approved',
        'born_at',
        'gender',
        'forget_pass_token',
        'created_at',
        'updated_at',
      ],
    });
  }

  async update(user: User) {
    return await this.usersRepository.save(user);
  }

  async updateUser(id: number, data: UpdateUserDto, callingAdminId?: number) {
    const user = await this.findOneById(id);

    if (!user) {
      throw new NotFoundException('هذا المستخدم غير موجود');
    }

    if (user.admin) {
      if (!callingAdminId) {
        throw new ForbiddenException('لا يمكن تعديل بيانات المشرف');
      }
      const callingAdmin = await this.findOneById(callingAdminId);
      if (!callingAdmin || !callingAdmin.admin.is_super)
        throw new ForbiddenException('لا يمكن تعديل بيانات المشرف');
    }

    Object.keys(data).forEach((key) => {
      if (isDefined(data[key])) {
        user[key] = data[key];
      }
    });

    return await this.update(user);
  }

  async approveUser(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('هذا المستخدم غير موجود');
    }

    user.approved = true;

    await this.update(user);
  }

  async delete(id: number, callingAdminId: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (user.admin) {
      const callingAdmin = await this.findOneById(callingAdminId);
      if (!callingAdmin || !callingAdmin.admin.is_super)
        throw new ForbiddenException('لا يمكن حذف المشرف');
    }

    if (!user) {
      throw new NotFoundException('هذا المستخدم غير موجود');
    }

    await this.usersRepository.delete(id);
  }
}
