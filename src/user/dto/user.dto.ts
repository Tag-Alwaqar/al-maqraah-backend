import { Admin } from '@user/entities/admin.entity';
import { Student } from '@user/entities/student.entity';
import { Teacher } from '@user/entities/teacher.entity';
import { User } from '@user/entities/user.entity';
import { Gender } from '@user/enums/gender.enum';
import { Expose } from 'class-transformer';

export class AdminDto {
  id: number;
  user_id: number;
  constructor(admin: Admin) {
    this.id = admin.id;
    this.user_id = admin.user_id;
  }
}

export class TeacherDto {
  id: number;
  user_id: number;
  constructor(teacher: Teacher) {
    this.id = teacher.id;
    this.user_id = teacher.user_id;
  }
}

export class StudentDto {
  id: number;
  user_id: number;
  current_surah: number;
  current_ayah?: number;
  constructor(student: Student) {
    this.id = student.id;
    this.user_id = student.user_id;
    this.current_surah = student.current_surah;
    this.current_ayah = student.current_ayah;
  }
}

export class UserDto {
  id: number;
  code: string;
  name: string;
  created_at: Date;
  updated_at: Date;
  born_at: Date;
  phone: string;
  gender: Gender;
  approved: boolean;
  admin?: AdminDto;
  teacher?: TeacherDto;
  student?: StudentDto;
  constructor(user: User) {
    this.id = user.id;
    this.code = user.code;
    this.name = user.name;
    this.created_at = user.created_at;
    this.updated_at = user.updated_at;
    this.born_at = user.born_at;
    this.phone = user.phone;
    this.gender = user.gender;
    this.approved = user.approved;
    if (user.admin) {
      this.admin = new AdminDto(user.admin);
    }
    if (user.teacher) {
      this.teacher = new TeacherDto(user.teacher);
    }
    if (user.student) {
      this.student = new StudentDto(user.student);
    }
  }
}

export class GetUserResponseDto extends UserDto {
  forget_pass_token?: string;
  constructor(user: User) {
    super(user);
    this.forget_pass_token = user.forget_pass_token;
  }
}
