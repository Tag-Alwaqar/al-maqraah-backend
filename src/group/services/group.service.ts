import { PageOptionsDto } from '@common/dtos/page-option.dto';
import { PaginationService } from '@common/pagination.service';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { isDefined } from 'class-validator';
import { Group } from '../entities/group.entity';
import { CreateGroupDto } from '@group/dto/create-group.dto';
import { GroupsQueryDto } from '@group/dto/groups-query.dto';
import { GroupDto } from '@group/dto/group.dto';
import { UpdateGroupDto } from '@group/dto/update-group.dto';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupsRepository: Repository<Group>,
    private readonly paginationService: PaginationService,
  ) {}

  async create(data: CreateGroupDto, adminId: number) {
    const existingNameGroup = await this.groupsRepository.findOne({
      where: { name: data.name },
    });
    if (existingNameGroup) {
      throw new ConflictException('هذا الإسم موجود بالفعل');
    }

    const group = this.groupsRepository.create({
      ...data,
      admin_id: adminId,
    });
    return await this.groupsRepository.save(group);
  }

  async findAll(pageOptionsDto: PageOptionsDto, groupsQuery: GroupsQueryDto) {
    const query = this.groupsRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.admin', 'admin');

    if (isDefined(groupsQuery.name)) {
      query.andWhere('group.name LIKE :name', {
        name: `%${groupsQuery.name}%`,
      });
    }

    if (isDefined(groupsQuery.type)) {
      query.andWhere('group.type = :type', { type: groupsQuery.type });
    }

    if (isDefined(groupsQuery.gender)) {
      query.andWhere('group.gender = :gender', { gender: groupsQuery.gender });
    }

    return this.paginationService.paginate({
      pageOptionsDto,
      query,
      mapToDto: async (groups: Group[]) =>
        groups.map((group) => new GroupDto(group)),
    });
  }

  async findById(id: number): Promise<Group> {
    const group = await this.groupsRepository.findOne({
      where: { id },
    });

    if (!group) {
      throw new NotFoundException('هذه المجموعة غير موجودة');
    }

    return group;
  }

  async update(group: Group) {
    return await this.groupsRepository.save(group);
  }

  async updateGroup(id: number, data: UpdateGroupDto) {
    const group = await this.findById(id);

    if (!group) {
      throw new NotFoundException('هذه المجموعة غير موجودة');
    }

    const { name, ...rest } = data;

    if (isDefined(name)) {
      const existingNameGroup = await this.groupsRepository.findOne({
        where: { name, id: Not(id) },
      });
      if (existingNameGroup) {
        throw new ConflictException('هذا الإسم موجود بالفعل');
      }

      group.name = name;
    }

    Object.keys(rest).forEach((key) => {
      if (isDefined(rest[key])) {
        group[key] = rest[key];
      }
    });

    return await this.update(group);
  }

  async delete(id: number) {
    const group = await this.groupsRepository.findOne({
      where: { id },
    });

    if (!group) {
      throw new NotFoundException('هذه المجموعة غير موجودة');
    }

    await this.groupsRepository.delete(id);
  }
}
