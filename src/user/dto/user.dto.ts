import { Admin } from '@user/entities/admin.entity';
import { Student } from '@user/entities/student.entity';
import { Teacher } from '@user/entities/teacher.entity';
import { User } from '@user/entities/user.entity';
import { Gender } from '@user/enums/gender.enum';
import { UserType } from '@user/enums/user-type.enum';

export class AdminDto {
  id: number;
  user_id: number;
  is_super: boolean;
  constructor(admin: Admin) {
    this.id = admin.id;
    this.user_id = admin.user_id;
    this.is_super = admin.is_super;
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
  user?: UserDto;
  constructor(student: Student) {
    this.id = student.id;
    this.current_surah = student.current_surah;
    if (student.current_ayah) this.current_ayah = student.current_ayah;
    if (student.user) this.user = new UserDto(student.user);
    else this.user_id = student.user_id;
  }
}

export class UserDto {
  id: number;
  code: string;
  name: string;
  created_at: Date;
  updated_at: Date;
  born_at: Date;
  age: number;
  phone: string;
  gender: Gender;
  approved: boolean;
  type: UserType;
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
    this.age = user.age;
    this.phone = user.phone;
    this.gender = user.gender;
    this.approved = user.approved;
    if (user.admin) {
      this.admin = new AdminDto(user.admin);
      this.type = UserType.Admin;
    }
    if (user.teacher) {
      this.teacher = new TeacherDto(user.teacher);
      this.type = UserType.Teacher;
    }
    if (user.student) {
      this.student = new StudentDto(user.student);
      this.type = UserType.Student;
    }
  }
}

export class ReversedAdminDto extends UserDto {
  constructor(admin: Admin) {
    super(admin.user);
    delete admin.user;
    this.admin = new AdminDto(admin);
    this.type = UserType.Admin;
  }
}

export class ReversedTeacherDto extends UserDto {
  constructor(teacher: Teacher) {
    super(teacher.user);
    delete teacher.user;
    this.teacher = new TeacherDto(teacher);
    this.type = UserType.Teacher;
  }
}

export class ReversedStudentDto extends UserDto {
  constructor(student: Student) {
    super(student.user);
    delete student.user;
    this.student = new StudentDto(student);
    this.type = UserType.Student;
  }
}

export class GetUserResponseDto extends UserDto {
  forget_pass_token?: string;
  constructor(user: User) {
    super(user);
    this.forget_pass_token = user.forget_pass_token;
  }
}
