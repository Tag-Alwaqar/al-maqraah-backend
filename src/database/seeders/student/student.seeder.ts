import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeederInterface } from '@seeders/seeder.interface';
import { User } from '@user/entities/user.entity';
import { Student } from '@user/entities/student.entity';
import { studentUsers, students } from './student.data';

@Injectable()
export class StudentSeeder implements SeederInterface {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async seed() {
    try {
      for (let i = 0; i < studentUsers.length; i++) {
        const existingUser = await this.userRepository.findOne({
          where: { code: studentUsers[i].code },
        });

        if (existingUser) {
          console.log(
            `Skipping, user with code ${studentUsers[i].code} already exists.`,
          );
          continue;
        }

        const insertedUser = await this.userRepository.save(
          this.userRepository.create(studentUsers[i]),
        );

        const insertedStudent = await this.studentRepository.save(
          this.studentRepository.create({
            ...students[i],
            user: insertedUser,
          }),
        );

        insertedUser.student = insertedStudent;

        await this.userRepository.save(insertedUser);
      }
    } catch (error) {
      console.log('Error seeding student users: ', error);
    }
  }
}
