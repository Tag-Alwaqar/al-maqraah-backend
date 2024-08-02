import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignupDto } from '@user/authentication/dtos/signup.dto';
import { UpdateStudentDto } from '@user/dto/update-student.dto';
import { Student } from '@user/entities/student.entity';
import { isDefined } from 'class-validator';
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
