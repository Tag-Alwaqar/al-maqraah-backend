import { PageOptionsDto } from '@common/dtos/page-option.dto';
import { PaginationService } from '@common/pagination.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignupDto } from '@user/authentication/dtos/signup.dto';
import { UpdateUserDto } from '@user/dto/update-user.dto';
import { GetUserResponseDto } from '@user/dto/user.dto';
import { User } from '@user/entities/user.entity';
import { generateRandomCode } from '@user/utils/utils';
import { Repository } from 'typeorm';
import { UsersQueryDto } from '../dto/users-query.dto';
import { isDefined } from 'class-validator';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly paginationService: PaginationService,
  ) {}

  async signup(data: SignupDto) {
    let code: string;
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
      approved: false,
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

    if (usersQuery.admin === true && admin.admin.is_super) {
      query.andWhere('user.admin IS NOT NULL');
    } else if (usersQuery.teacher === true) {
      query.andWhere('user.teacher IS NOT NULL');
    } else if (usersQuery.student === true) {
      query.andWhere('user.student IS NOT NULL');
    }

    if (usersQuery.pending === true) {
      query.andWhere('user.approved = false');
    } else if (usersQuery.pending === false) {
      query.andWhere('user.approved = true');
    }

    if (usersQuery.forgot_pass === true) {
      query.andWhere('user.forget_pass_token IS NOT NULL');
    } else if (usersQuery.forgot_pass === false) {
      query.andWhere('user.forget_pass_token IS NULL');
    }

    query.orderBy('user.name', 'ASC');

    return this.paginationService.paginate({
      pageOptionsDto,
      query,
      mapToDto: async (users: User[]) =>
        users.map((user) => new GetUserResponseDto(user)),
    });
  }

  async findOneById(id: number): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { id },
      relations: ['admin', 'teacher', 'student'],
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

  async updateUser(id: number, data: UpdateUserDto) {
    const user = await this.findOneById(id);

    if (!user) {
      throw new NotFoundException('هذا المستخدم غير موجود');
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

  async delete(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('هذا المستخدم غير موجود');
    }

    await this.usersRepository.delete(id);
  }
}
