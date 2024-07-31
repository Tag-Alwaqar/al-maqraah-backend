import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeederInterface } from '@seeders/seeder.interface';
import { User } from '@user/entities/user.entity';
import { Admin } from '@user/entities/admin.entity';
import { adminUsers } from './admin.data';

@Injectable()
export class AdminSeeder implements SeederInterface {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async seed() {
    const data = adminUsers;

    console.log('Seeding admin users...');
    console.log(data);

    try {
      for (const user of data) {
        const insertedUser = await this.userRepository.save(
          this.userRepository.create(user),
        );

        const insertedAdmin = await this.adminRepository.save(
          this.adminRepository.create({
            is_super: true,
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
