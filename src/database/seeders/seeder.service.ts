import { Injectable } from '@nestjs/common';
import { SeederInterface } from './seeder.interface';
import { AdminSeeder } from './admin/admin.seeder';
import { EntityManager } from 'typeorm';

@Injectable()
export class SeederService {
  private readonly seeders: SeederInterface[] = [];

  constructor(
    private readonly manager: EntityManager,
    private readonly adminSeeder: AdminSeeder,
  ) {
    this.seeders = [this.adminSeeder];
  }

  async seed() {
    // await this.manager.connection.dropDatabase();
    // await this.manager.connection.synchronize(true);

    for (let i = 0; i < this.seeders.length; i++) {
      await this.seeders[i].seed();
      console.log('seeded');
    }
  }
}
