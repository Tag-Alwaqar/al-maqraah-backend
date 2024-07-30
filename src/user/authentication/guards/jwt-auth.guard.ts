import { ExecutionContext, Injectable } from '@nestjs/common';
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

    if (!userInfo) return false;

    const user = await this.usersService.findOneById(userInfo.id);

    if (!user || !user.approved) return false;

    return result;
  }
}
