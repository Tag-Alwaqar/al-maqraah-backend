import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserInfo } from './dtos/user-info.dto';
import { User } from '@user/entities/user.entity';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { ForgetPasswordDto } from './dtos/forget-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { UsersService } from '@user/services/user.service';
import { SignupDto } from './dtos/signup.dto';
import { StudentsService } from '@user/services/student.service';
import { TeachersService } from '@user/services/teacher.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly studentsService: StudentsService,
    private readonly teachersService: TeachersService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto) {
    const user = await this.usersService.signup(signupDto);

    switch (signupDto.user_type) {
      case 'student':
        const student = await this.studentsService.signup(user.id, signupDto);
        user.student = student;
        await this.usersService.update(user);
        break;
      case 'teacher':
        const teacher = await this.teachersService.signup(user.id);
        user.teacher = teacher;
        await this.usersService.update(user);
        break;
    }

    return await this.usersService.findOneById(user.id);
  }

  async validateUser(code: string, password: string) {
    const user = await this.usersService.findOneByCodeWithPassword(code);

    if (user === null) {
      throw new UnauthorizedException('كود المستخدم أو كلمة السر غير صحيحين');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('كود المستخدم أو كلمة السر غير صحيحين');
    }

    return user;
  }

  async changePassword(
    userInfo: UserInfo,
    changePasswordDto: ChangePasswordDto,
  ) {
    const user = await this.usersService.findOneByIdWithPassword(userInfo.id);

    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.old_password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('كلمة السر القديمة غير صحيحة');
    }

    user.password = changePasswordDto.new_password;

    return await this.usersService.update(user);
  }

  async forgetPassword(forgetPasswordDto: ForgetPasswordDto) {
    const user = await this.usersService.findOneByCodeWithPassword(
      forgetPasswordDto.code,
    );
    if (!user) throw new NotFoundException('هذا الكود غير موجود');

    const token = this.jwtService.sign({ id: user.id }, { expiresIn: '1d' });

    user.forget_pass_token = token;

    await this.usersService.update(user);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    let token = null;
    try {
      token = this.jwtService.verify(resetPasswordDto.token);
    } catch (error) {
      throw new BadRequestException(
        'لقد انتهت صلاحية هذا الرابط أو إنه غير صحيح، يُرجى إعادة طلب تغيير كلمة السر',
      );
    }

    const user: User = await this.usersService.findOneByIdAndToken(
      token.id,
      resetPasswordDto.token,
    );

    if (
      !user ||
      user.forget_pass_token !== resetPasswordDto.token ||
      user.code !== resetPasswordDto.code
    ) {
      throw new BadRequestException(
        'لقد انتهت صلاحية هذا الرابط أو إنه غير صحيح، يُرجى إعادة طلب تغيير كلمة السر',
      );
    }

    user.password = resetPasswordDto.new_password;
    user.forget_pass_token = null;

    return await this.usersService.update(user);
  }

  async generateToken(user: User) {
    const token = this.jwtService.sign(
      {
        ...user,
      },
      { expiresIn: '10d' },
    );
    return token;
  }
}
