import { mapEntityToDto } from '@common/mappers';
import {
  Request,
  Post,
  UseGuards,
  Body,
  Get,
  Controller,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '@user/authentication/auth.service';
import {
  SignupDto,
  LoginSignupResponseDto,
} from '@user/authentication/dtos/signup.dto';
import { UserInfo } from '@user/authentication/dtos/user-info.dto';
import { JwtAuthGuard } from '@user/authentication/guards/jwt-auth.guard';
import { LocalAuthGuard } from '@user/authentication/guards/local-auth.guard';
import { UserDto } from '@user/dto/user.dto';
import { UsersService } from '@user/services/user.service';

@ApiTags('user.auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}
  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    const user = await this.authService.signup(signupDto);

    const token = await this.authService.generateToken(user);

    const mappedUser = new UserDto(user);

    return new LoginSignupResponseDto(mappedUser, token);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req: any) {
    const token = await this.authService.generateToken(req.user);

    const user = await this.usersService.findOneById(req.user.id);

    const mappedUser = new UserDto(user);

    return new LoginSignupResponseDto(mappedUser, token);
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  async getUser(@Request() req: any) {
    const user = await this.usersService.findOneById(req.user.id);
    return { user: new UserInfo(user) };
  }

  // @Post('change-password')
  // @UseGuards(AuthenticatedGuard)
  // changePassword(
  //   @Admin() adminInfo: AdminInfo,
  //   @Body() changePasswordDto: ChangePasswordDtoV2,
  // ) {
  //   return this.authService.changePassword(adminInfo, {
  //     oldPassword: changePasswordDto.old_password,
  //     newPassword: changePasswordDto.new_password,
  //   });
  // }

  // @Post('forget-password')
  // async forgetPassword(@Body() forgetPasswordDto: ForgetAdminPasswordDto) {
  //   await this.authService.forgetPassword(forgetPasswordDto);
  // }

  // @Post('reset-password')
  // async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
  //   await this.authService.resetPassword(resetPasswordDto);
  // }
}
