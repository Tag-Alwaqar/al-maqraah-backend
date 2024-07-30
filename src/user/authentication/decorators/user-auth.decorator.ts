import { UseGuards, applyDecorators } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

export function UserAuth(): MethodDecorator {
  return applyDecorators(UseGuards(JwtAuthGuard));
}
