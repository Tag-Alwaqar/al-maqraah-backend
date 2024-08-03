import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserInfo } from '../dtos/user-info.dto';
import { UsersService } from '@user/services/user.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const result = (await super.canActivate(context)) as boolean;

    const userInfo: UserInfo = context.switchToHttp().getRequest().user;

    if (!userInfo) throw new UnauthorizedException('يجب تسجيل الدخول أولاً');

    const user = await this.usersService.findOneById(userInfo.id);

    if (!user || !user.approved)
      throw new UnauthorizedException('يجب تسجيل الدخول أولاً');

    return result;
  }
}
