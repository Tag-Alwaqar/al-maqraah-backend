import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from '@user/entities/admin.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminsRepository: Repository<Admin>,
  ) {}

  async findOneById(id: number): Promise<Admin | null> {
    return await this.adminsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }
}
