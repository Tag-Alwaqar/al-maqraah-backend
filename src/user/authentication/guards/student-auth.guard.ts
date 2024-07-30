import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UsersService } from '@user/services/user.service';
import { UserInfo } from '../dtos/user-info.dto';

@Injectable()
export class StudentAuthGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const userInfo: UserInfo = context.switchToHttp().getRequest().user;

    if (!userInfo) return false;

    const user = await this.usersService.findOneById(userInfo.id);

    return user.student !== null;
  }
}
