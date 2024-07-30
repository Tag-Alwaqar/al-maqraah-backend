import {
  Request,
  Post,
  UseGuards,
  Body,
  Get,
  Controller,
  HttpCode,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '@user/authentication/auth.service';
import { User } from '@user/authentication/decorators/user.decorator';
import { ChangePasswordDto } from '@user/authentication/dtos/change-password.dto';
import { ForgetPasswordDto } from '@user/authentication/dtos/forget-password.dto';
import { ResetPasswordDto } from '@user/authentication/dtos/reset-password.dto';
import {
  SignupDto,
  LoginSignupResponseDto,
} from '@user/authentication/dtos/signup.dto';
import { UserInfo } from '@user/authentication/dtos/user-info.dto';
import { JwtAuthGuard } from '@user/authentication/guards/jwt-auth.guard';
import { LocalAuthGuard } from '@user/authentication/guards/local-auth.guard';
import { UserDto } from '@user/dto/user.dto';
import { UsersService } from '@user/services/user.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}
  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    await this.authService.signup(signupDto);

    return {
      message:
        'تم إنشاء الحساب بنجاح، يُرجى انتظار تفعيل حسابك فهذه العملية تأخذ بعض الوقت',
    };
  }

  @Post('login')
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  async login(@Request() req: any) {
    const token = await this.authService.generateToken(req.user);

    const user = await this.usersService.findOneById(req.user.id);

    const mappedUser = new UserDto(user);

    return new LoginSignupResponseDto(mappedUser, token);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@User() userInfo: UserInfo) {
    const user = await this.usersService.findOneById(userInfo.id);
    return { user: new UserDto(user) };
  }

  @Post('change-password')
  @HttpCode(200)
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

  @Post('forget-password')
  @HttpCode(200)
  async forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    await this.authService.forgetPassword(forgetPasswordDto);

    return {
      message:
        'سيقوم المشرف بإرسال رابط تغيير كلمة السر إلى رقمك علر الواتساب، يُرجى انتظاره فهذه العملية تأخذ بعض الوقت',
    };
  }

  @Post('reset-password')
  @HttpCode(200)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.resetPassword(resetPasswordDto);

    return {
      message: 'تم تغيير كلمة السر بنجاح',
    };
  }
}
