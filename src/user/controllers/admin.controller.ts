import { PageOptionsDto } from '@common/dtos/page-option.dto';
import { Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminAuth } from '@user/authentication/decorators/admin-auth.decorator';
import { UsersQueryDto } from '@user/dto/users-query.dto';
import { AdminsService } from '@user/services/admin.service';
import { UsersService } from '@user/services/user.service';

@ApiTags('Admin')
@Controller('admins')
export class AdminController {
  constructor(
    private readonly adminsService: AdminsService,
    private readonly usersService: UsersService,
  ) {}

  @Get('users')
  @AdminAuth()
  async getUsers(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query() usersQueryDto: UsersQueryDto,
  ) {
    return this.usersService.findAll(pageOptionsDto, usersQueryDto);
  }

  @Patch('users/:id/approve')
  @AdminAuth()
  async approveUser(@Param('id') id: string) {
    await this.usersService.approveUser(+id);

    return { message: 'تم تفعيل الحساب بنجاح' };
  }
}
