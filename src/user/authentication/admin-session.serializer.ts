import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UserInfo } from './dtos/user-info.dto';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(
    user: UserInfo,
    done: (err: Error, user: UserInfo) => void,
  ): any {
    done(null, user);
  }
  deserializeUser(
    payload: any,
    done: (err: Error, payload: UserInfo) => void,
  ): any {
    done(null, payload);
  }
}
