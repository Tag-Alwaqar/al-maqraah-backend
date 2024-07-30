import { UseGuards, applyDecorators } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { TeacherAuthGuard } from '../guards/teacher-auth.guard';

export function TeacherAuth(): MethodDecorator {
  return applyDecorators(UseGuards(JwtAuthGuard), UseGuards(TeacherAuthGuard));
}
