import { PageOptionsDto } from '@common/dtos/page-option.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminAuth } from '@user/authentication/decorators/admin-auth.decorator';
import { User } from '@user/authentication/decorators/user.decorator';
import {
  AssignStudentToGroupDto,
  RemoveStudentFromGroupDto,
} from '@user/dto/assign-student-to-group.dto';
import { UpdateStudentDto } from '@user/dto/update-student.dto';
import { UpdateUserDto } from '@user/dto/update-user.dto';
import { UsersQueryDto } from '@user/dto/users-query.dto';
import { AdminsService } from '@user/services/admin.service';
import { StudentsService } from '@user/services/student.service';
import { UsersService } from '@user/services/user.service';

@ApiTags('Admin')
@Controller('admins')
export class AdminController {
  constructor(
    private readonly adminsService: AdminsService,
    private readonly usersService: UsersService,
    private readonly studentsService: StudentsService,
  ) {}

  @Patch('assign-student-to-group')
  @AdminAuth()
  async assignStudentToGroup(@Body() data: AssignStudentToGroupDto) {
    await this.adminsService.assignStudentToGroup(data);

    return { message: 'تم إدخال الطالب في المجموعة' };
  }

  @Patch('remove-student-from-group')
  @AdminAuth()
  async removeStudentFromGroup(@Body() data: RemoveStudentFromGroupDto) {
    await this.adminsService.removeStudentFromGroup(data);

    return { message: 'تم مسح الطالب من المجموعة' };
  }

  @Get('users')
  @AdminAuth()
  async getUsers(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query() usersQueryDto: UsersQueryDto,
    @User('id') callingAdminId: number,
  ) {
    return await this.usersService.findAll(
      pageOptionsDto,
      usersQueryDto,
      callingAdminId,
    );
  }

  @Patch('users/:id/approve')
  @AdminAuth()
  async approveUser(@Param('id') id: string) {
    await this.usersService.approveUser(+id);

    return { message: 'تم تفعيل الحساب بنجاح' };
  }

  @Patch('users/:id')
  @AdminAuth()
  async updateUser(
    @User('id') callingAdminId: string,
    @Param('id') id: string,
    @Body() data: UpdateUserDto,
  ) {
    await this.usersService.updateUser(+id, data, +callingAdminId);

    return { message: 'تم تحديث البيانات بنجاح' };
  }

  @Delete('users/:id')
  @AdminAuth()
  async deleteUser(@Param('id') id: string) {
    await this.usersService.delete(+id);

    return { message: 'تم حذف الحساب بنجاح' };
  }

  @Patch('students/:id')
  @AdminAuth()
  async updateStudent(@Param('id') id: string, @Body() data: UpdateStudentDto) {
    await this.studentsService.updateStudent(+id, data);

    return { message: 'تم تحديث البيانات بنجاح' };
  }
}
