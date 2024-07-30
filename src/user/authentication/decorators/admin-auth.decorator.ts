import { UseGuards, applyDecorators } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AdminAuthGuard } from '../guards/admin-auth.guard';

export function AdminAuth(): MethodDecorator {
  return applyDecorators(UseGuards(JwtAuthGuard), UseGuards(AdminAuthGuard));
}
