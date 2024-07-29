import { ClsService } from 'nestjs-cls';

export class RequestContext {
  static cls: ClsService;
  static USER_ID_KEY = 'user.userId';
  static setCls(cls: ClsService) {
    this.cls = cls;
  }

  public static hasUser(): boolean {
    if (this.cls == null) return false;
    if (this.cls.has(this.USER_ID_KEY)) return true;
    return false;
  }
  public static getCurrentUser(): { id: number } {
    if (this.cls == null) throw Error('CLS NOT INITIALIZED CORRECTLY');
    if (this.cls.has(this.USER_ID_KEY)) {
      const id = this.cls.get(this.USER_ID_KEY) as number;

      return { id };
    }
  }

  public static setCurrentUser(userId: number) {
    if (this.cls == null) throw Error('CLS NOT INITIALIZED CORRECTLY');

    this.cls.set(this.USER_ID_KEY, userId);
  }
}
