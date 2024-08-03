import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '@user/services/user.service';
import { UserInfo } from '../dtos/user-info.dto';

@Injectable()
export class TeacherAuthGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const userInfo: UserInfo = context.switchToHttp().getRequest().user;

    if (!userInfo) throw new ForbiddenException('يجب تسجيل الدخول أولاً');

    const user = await this.usersService.findOneById(userInfo.id);

    if (user.teacher === null)
      throw new ForbiddenException('ليس لديك صلاحية الوصول إلى هذه المعلومات');

    return true;
  }
}
