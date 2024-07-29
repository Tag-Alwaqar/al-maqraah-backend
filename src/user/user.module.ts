import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionSerializer } from './authentication/admin-session.serializer';
import { LocalStrategy } from './authentication/strategies/local.strategy';
import { AuthService } from './authentication/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './authentication/strategies/jwt.strategy';
import { JwtAuthGuard } from './authentication/guards/jwt-auth.guard';
import { Admin } from './entities/admin.entity';
import { UsersService } from './services/user.service';
import { AuthController } from './controllers/auth.controller';
import { User } from './entities/user.entity';
import { CommonModule } from '@common/common.module';
import { StudentsService } from './services/student.service';
import { TeachersService } from './services/teacher.service';
import { Student } from './entities/student.entity';
import { Teacher } from './entities/teacher.entity';
import { AdminsService } from './services/admin.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
        };
      },
      inject: [ConfigService],
    }),
    PassportModule.register({ session: true }),
    TypeOrmModule.forFeature([User, Admin, Student, Teacher]),
    CommonModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    AdminsService,
    StudentsService,
    TeachersService,
    SessionSerializer,
    LocalStrategy,
    JwtStrategy,
    JwtAuthGuard,
  ],
  exports: [
    AuthService,
    UsersService,
    AdminsService,
    StudentsService,
    TeachersService,
    SessionSerializer,
    LocalStrategy,
    JwtStrategy,
    JwtAuthGuard,
  ],
})
export class UserModule {}
