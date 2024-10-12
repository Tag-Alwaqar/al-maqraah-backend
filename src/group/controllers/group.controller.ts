import { PageOptionsDto } from '@common/dtos/page-option.dto';
import { AppointmentsQueryDto } from '@group/dto/appointments-query.dto';
import { CreateGroupAppointmentDto } from '@group/dto/create-group-appointment.dto';
import { CreateGroupDto } from '@group/dto/create-group.dto';
import { GroupAppointmentDto } from '@group/dto/group-appointment.dto';
import { GroupDto } from '@group/dto/group.dto';
import { GroupsQueryDto } from '@group/dto/groups-query.dto';
import { UpdateGroupDto } from '@group/dto/update-group.dto';
import { GroupsService } from '@group/services/group.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminAuth } from '@user/authentication/decorators/admin-auth.decorator';
import { UserAuth } from '@user/authentication/decorators/user-auth.decorator';
import { User } from '@user/authentication/decorators/user.decorator';

@ApiTags('Group')
@Controller('groups')
export class GroupController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get('')
  @UserAuth()
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query() groupsQueryDto: GroupsQueryDto,
    @User('id') callingUserId: number,
  ) {
    return await this.groupsService.findAll(
      pageOptionsDto,
      groupsQueryDto,
      callingUserId,
    );
  }

  @Get('appointments')
  @AdminAuth()
  async getAppointments(@Query() queryDto: AppointmentsQueryDto) {
    const appointments = await this.groupsService.getAppointments(queryDto);

    return appointments.map(
      (appointment) => new GroupAppointmentDto(appointment),
    );
  }

  @Get(':id')
  @UserAuth()
  async findById(@Param('id') id: string, @User('id') callingUserId: number) {
    const group = await this.groupsService.findById(+id, callingUserId);

    return new GroupDto(group);
  }

  @Post('')
  @AdminAuth()
  async create(@Body() data: CreateGroupDto, @User('id') adminId: number) {
    const group = await this.groupsService.create(data, adminId);

    return new GroupDto(group);
  }

  @Patch(':id')
  @AdminAuth()
  async update(@Param('id') id: string, @Body() data: UpdateGroupDto) {
    const group = await this.groupsService.updateGroup(+id, data);

    return new GroupDto(group);
  }

  @Post(':id/appointments')
  @AdminAuth()
  async createAppointment(
    @Body() data: CreateGroupAppointmentDto,
    @Param('id') id: string,
  ) {
    const group = await this.groupsService.addGroupAppointment(+id, data);

    return new GroupDto(group);
  }

  @Delete(':id/appointments/:appointmentId')
  @AdminAuth()
  async deleteAppointment(
    @Param('id') id: string,
    @Param('appointmentId') appointmentId: string,
  ) {
    const group = await this.groupsService.removeGroupAppointment(
      +id,
      +appointmentId,
    );

    return new GroupDto(group);
  }

  @Delete(':id')
  @AdminAuth()
  async delete(@Param('id') id: string) {
    await this.groupsService.delete(+id);

    return { message: 'تم حذف المجموعة بنجاح' };
  }
}
