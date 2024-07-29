import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'code',
    });
  }

  async validate(code: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(code, password);

    if (!user) {
      throw new UnauthorizedException('من فضلك قم بتسجيل الدخول');
    }

    if (!user.approved) {
      throw new UnauthorizedException('لم يتم تفعيل حسابك بعد');
    }

    return user; // This will be set to request.user
  }
}
