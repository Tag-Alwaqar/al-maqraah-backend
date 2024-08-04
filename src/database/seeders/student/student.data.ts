import { PartialType } from '@nestjs/swagger';
import { Student } from '@user/entities/student.entity';
import { User } from '@user/entities/user.entity';
import { Gender } from '@user/enums/gender.enum';

class UserSeed extends PartialType(User) {}
class StudentSeed extends PartialType(Student) {}

export const studentUsers: UserSeed[] = [
  {
    code: '223456',
    name: 'طالب 1',
    password: 'student_2024',
    phone: '01000000000',
    gender: Gender.Male,
    born_at: new Date('2000-01-01'),
    approved: true,
  },
  {
    code: '223457',
    name: 'طالب 2',
    password: 'student_2024',
    phone: '01000000000',
    gender: Gender.Male,
    born_at: new Date('2000-01-01'),
    approved: false,
  },
];

export const students: StudentSeed[] = [
  {
    current_surah: 5,
    current_ayah: 10,
  },
  {
    current_surah: 110,
    current_ayah: 1,
  },
];
