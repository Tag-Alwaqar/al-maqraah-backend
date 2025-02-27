import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeederInterface } from '@seeders/seeder.interface';
import { User } from '@user/entities/user.entity';
import { Admin } from '@user/entities/admin.entity';
import { adminUsers, admins } from './admin.data';

@Injectable()
export class AdminSeeder implements SeederInterface {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async seed() {
    try {
      for (let i = 0; i < adminUsers.length; i++) {
        const existingUser = await this.userRepository.findOne({
          where: { code: adminUsers[i].code },
        });

        if (existingUser) {
          console.log(
            `Skipping, user with code ${adminUsers[i].code} already exists.`,
          );
          continue;
        }

        const insertedUser = await this.userRepository.save(
          this.userRepository.create(adminUsers[i]),
        );

        const insertedAdmin = await this.adminRepository.save(
          this.adminRepository.create({
            ...admins[i],
            user: insertedUser,
          }),
        );

        insertedUser.admin = insertedAdmin;

        await this.userRepository.save(insertedUser);
      }
    } catch (error) {
      console.log('Error seeding admin users: ', error);
    }
  }
}
