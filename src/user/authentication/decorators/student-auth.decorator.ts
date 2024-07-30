import { UseGuards, applyDecorators } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { StudentAuthGuard } from '../guards/student-auth.guard';

export function StudentAuth(): MethodDecorator {
  return applyDecorators(UseGuards(JwtAuthGuard), UseGuards(StudentAuthGuard));
}
