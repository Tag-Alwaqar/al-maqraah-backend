import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from '@user/entities/teacher.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teachersRepository: Repository<Teacher>,
  ) {}

  async signup(userId: number) {
    const teacher = this.teachersRepository.create({
      user_id: userId,
    });
    return await this.teachersRepository.save(teacher);
  }

  async findOneById(id: number): Promise<Teacher | null> {
    return await this.teachersRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }
}
