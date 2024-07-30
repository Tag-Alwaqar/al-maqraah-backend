import { PaginationService } from '@common/pagination.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignupDto } from '@user/authentication/dtos/signup.dto';
import { UpdateUserDto } from '@user/dto/update-user.dto';
import { User } from '@user/entities/user.entity';
import { generateRandomCode } from '@user/utils/utils';
import { Repository } from 'typeorm';

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
      approved: true, // TODO: change to false when approve feature is implemented
    });
    return await this.usersRepository.save(user);
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

  async updateUser(id: number, data: UpdateUserDto) {}

  async approveUser(id: number) {}

  async delete(id: number) {}
}
