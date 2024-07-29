import { PaginationService } from '@common/pagination.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignupDto } from '@user/authentication/dtos/signup.dto';
import { Student } from '@user/entities/student.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
  ) {}

  async signup(userId: number, data: SignupDto) {
    const student = this.studentsRepository.create({
      user_id: userId,
      current_surah: data.current_surah,
      current_ayah: data.current_ayah,
    });
    return await this.studentsRepository.save(student);
  }

  async findOneById(id: number): Promise<Student | null> {
    return await this.studentsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }
}
