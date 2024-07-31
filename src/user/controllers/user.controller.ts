import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserAuth } from '@user/authentication/decorators/user-auth.decorator';
import { User } from '@user/authentication/decorators/user.decorator';
import { UserInfo } from '@user/authentication/dtos/user-info.dto';
import { UpdateUserDto } from '@user/dto/update-user.dto';
import { UserDto } from '@user/dto/user.dto';
import { UsersService } from '@user/services/user.service';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UserAuth()
  async getMe(@User() userInfo: UserInfo) {
    const user = await this.usersService.findOneById(userInfo.id);
    return { user: new UserDto(user) };
  }

  @Patch('me')
  @UserAuth()
  async updateMe(@User('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.updateUser(id, updateUserDto);
    return { user: new UserDto(user) };
  }
}
