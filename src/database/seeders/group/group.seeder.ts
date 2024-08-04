import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeederInterface } from '@seeders/seeder.interface';
import { Admin } from '@user/entities/admin.entity';
import { Group } from '@group/entities/group.entity';
import { groups } from './group.data';
import { Student } from '@user/entities/student.entity';
import { Gender } from '@user/enums/gender.enum';

@Injectable()
export class GroupSeeder implements SeederInterface {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async seed() {
    try {
      const query = this.studentRepository
        .createQueryBuilder('student')
        .leftJoinAndSelect('student.user', 'user')
        .where('user.gender = :gender', { gender: Gender.Male });

      const students = await query.getMany();

      for (let i = 0; i < groups.length; i++) {
        const existingGroup = await this.groupRepository.findOne({
          where: { name: groups[i].name },
        });

        if (existingGroup) {
          console.log(
            `Skipping, group with name ${groups[i].name} already exists.`,
          );
          continue;
        }

        const superAdmin = await this.adminRepository.findOne({
          where: { is_super: true },
        });

        await this.groupRepository.save(
          this.groupRepository.create({
            ...groups[i],
            admin: superAdmin,
            students: groups[i].gender === Gender.Male ? students : [],
          }),
        );
      }
    } catch (error) {
      console.log('Error seeding groups: ', error);
    }
  }
}
