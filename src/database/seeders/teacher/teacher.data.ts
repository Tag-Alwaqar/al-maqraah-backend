import { PartialType } from '@nestjs/swagger';
import { Teacher } from '@user/entities/teacher.entity';
import { User } from '@user/entities/user.entity';
import { Gender } from '@user/enums/gender.enum';

class UserSeed extends PartialType(User) {}
class TeacherSeed extends PartialType(Teacher) {}

export const teacherUsers: UserSeed[] = [
  {
    code: '123456',
    name: 'معلم 1',
    password: 'teacher_2024',
    phone: '01000000000',
    gender: Gender.Male,
    born_at: new Date('2000-01-01'),
    approved: true,
  },
  {
    code: '123457',
    name: 'معلم 2',
    password: 'teacher_2024',
    phone: '01000000000',
    gender: Gender.Male,
    born_at: new Date('2000-01-01'),
    approved: false,
  },
];

export const teachers: TeacherSeed[] = [{}, {}];
