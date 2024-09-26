import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '@user/authentication/auth.service';
import { AdminAuth } from '@user/authentication/decorators/admin-auth.decorator';
import { UserAuth } from '@user/authentication/decorators/user-auth.decorator';
import { User } from '@user/authentication/decorators/user.decorator';
import { SignupDto } from '@user/authentication/dtos/signup.dto';
import { UserInfo } from '@user/authentication/dtos/user-info.dto';
import { UpdateMeDto } from '@user/dto/update-me.dto';
import { UpdateUserDto } from '@user/dto/update-user.dto';
import { UserDto } from '@user/dto/user.dto';
import { UsersService } from '@user/services/user.service';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @AdminAuth()
  async create(@Body() dto: SignupDto) {
    const user = await this.authService.signup(dto, true);
    return { user: new UserDto(user) };
  }

  @Get('me')
  @UserAuth()
  async getMe(@User() userInfo: UserInfo) {
    const user = await this.usersService.findOneById(userInfo.id);
    return { user: new UserDto(user) };
  }

  @Patch('me')
  @UserAuth()
  async updateMe(@User('id') id: number, @Body() updateMeDto: UpdateMeDto) {
    const user = await this.usersService.updateUser(id, updateMeDto);
    return { user: new UserDto(user) };
  }

  @Get(':id')
  @UserAuth()
  async findById(@Param('id') id: string, @User('id') userId: number) {
    const user = await this.usersService.findById(+id, userId);

    return { user: new UserDto(user) };
  }
}
