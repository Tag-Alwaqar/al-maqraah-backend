import { SoftDeletableEntity } from '@common/entities/soft-deletable.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Gender } from '../enums/gender.enum';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { Admin } from './admin.entity';
import { Teacher } from './teacher.entity';
import { Student } from './student.entity';

@Entity({ name: 'users' })
export class User extends SoftDeletableEntity {
  @Index({ unique: true, where: 'deleted_at IS NULL' })
  @Column()
  code: string;

  @Column({ select: false })
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ select: false })
  @Exclude({ toPlainOnly: true })
  previous_password!: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  phone: string;

  @Column()
  gender: Gender;

  @Column({ type: 'date' })
  born_at: Date;

  @Column({ default: false })
  approved: boolean;

  @Column({ nullable: true })
  forget_pass_token?: string;

  @Column({ nullable: true })
  admin_id?: number;

  @OneToOne(() => Admin, (admin) => admin.user, { nullable: true })
  @JoinColumn({ name: 'admin_id' })
  admin?: Admin;

  @Column({ nullable: true })
  teacher_id?: number;

  @OneToOne(() => Teacher, (teacher) => teacher.user, { nullable: true })
  @JoinColumn({ name: 'teacher_id' })
  teacher?: Teacher;

  @Column({ nullable: true })
  student_id?: number;

  @OneToOne(() => Student, (student) => student.user, { nullable: true })
  @JoinColumn({ name: 'student_id' })
  student?: Student;

  @BeforeInsert()
  @BeforeUpdate()
  async setPassword() {
    if (
      !this.previous_password ||
      (this.previous_password !== this.password && this.password)
    ) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
      this.previous_password = this.password;
    }
  }
}
