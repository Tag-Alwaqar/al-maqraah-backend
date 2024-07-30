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
import { User } from '@user/authentication/decorators/user.decorator';
import { ChangePasswordDto } from '@user/authentication/dtos/change-password.dto';
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
  async getUser(@User() userInfo: UserInfo) {
    const user = await this.usersService.findOneById(userInfo.id);
    return { user: new UserDto(user) };
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @User() userInfo: UserInfo,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.authService.changePassword(userInfo, changePasswordDto);

    return {
      message: 'تم تغيير كلمة السر بنجاح',
    };
  }

  // @Post('forget-password')
  // async forgetPassword(@Body() forgetPasswordDto: ForgetUserPasswordDto) {
  //   await this.authService.forgetPassword(forgetPasswordDto);
  // }

  // @Post('reset-password')
  // async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
  //   await this.authService.resetPassword(resetPasswordDto);
  // }
}
