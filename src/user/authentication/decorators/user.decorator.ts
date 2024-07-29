import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (attribute: string | null, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return attribute ? request.user[attribute] : request.user;
  },
);
