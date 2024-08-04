import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeederInterface } from '@seeders/seeder.interface';
import { User } from '@user/entities/user.entity';
import { Teacher } from '@user/entities/teacher.entity';
import { teacherUsers, teachers } from './teacher.data';

@Injectable()
export class TeacherSeeder implements SeederInterface {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
  ) {}

  async seed() {
    try {
      for (let i = 0; i < teacherUsers.length; i++) {
        const existingUser = await this.userRepository.findOne({
          where: { code: teacherUsers[i].code },
        });

        if (existingUser) {
          console.log(
            `Skipping, user with code ${teacherUsers[i].code} already exists.`,
          );
          continue;
        }

        const insertedUser = await this.userRepository.save(
          this.userRepository.create(teacherUsers[i]),
        );

        const insertedTeacher = await this.teacherRepository.save(
          this.teacherRepository.create({
            ...teachers[i],
            user: insertedUser,
          }),
        );

        insertedUser.teacher = insertedTeacher;

        await this.userRepository.save(insertedUser);
      }
    } catch (error) {
      console.log('Error seeding teacher users: ', error);
    }
  }
}
