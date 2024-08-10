import { Injectable } from '@nestjs/common';
import { SeederInterface } from './seeder.interface';
import { AdminSeeder } from './admin/admin.seeder';
import { TeacherSeeder } from './teacher/teacher.seeder';
import { StudentSeeder } from './student/student.seeder';
import { GroupSeeder } from './group/group.seeder';

@Injectable()
export class SeederService {
  private readonly seeders: SeederInterface[] = [];

  constructor(
    private readonly adminSeeder: AdminSeeder,
    private readonly teacherSeeder: TeacherSeeder,
    private readonly studentSeeder: StudentSeeder,
    private readonly groupSeeder: GroupSeeder,
  ) {
    this.seeders = [
      this.adminSeeder,
      this.teacherSeeder, // to be commented
      this.studentSeeder, // to be commented
      this.groupSeeder, // to be commented
    ];
  }

  async seed() {
    // await this.manager.connection.dropDatabase();
    // await this.manager.connection.synchronize(true);

    for (let i = 0; i < this.seeders.length; i++) {
      await this.seeders[i].seed();
    }

    console.log('seeded');
  }
}
