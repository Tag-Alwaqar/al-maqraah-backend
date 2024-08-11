import { PageOptionsDto } from '@common/dtos/page-option.dto';
import { GroupType } from '@group/enums/group-type.enum';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminAuth } from '@user/authentication/decorators/admin-auth.decorator';
import { UserAuth } from '@user/authentication/decorators/user-auth.decorator';
import { User } from '@user/authentication/decorators/user.decorator';
import {
  NotAssignedStudentsQueryDto,
  StudentsQueryDto,
} from '@user/dto/students-query.dto';
import { StudentsService } from '@user/services/student.service';

@ApiTags('Student')
@Controller('students')
export class StudentController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get('groups/:id')
  @UserAuth()
  async getGroupStudents(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query() studentsQueryDto: StudentsQueryDto,
    @Param('id') groupId: string,
    @User('id') callingUserId: number,
  ) {
    return await this.studentsService.getGroupStudents(
      pageOptionsDto,
      +groupId,
      callingUserId,
      studentsQueryDto,
    );
  }

  @Get('not-assigned')
  @AdminAuth()
  async getNotAssignedStudents(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query() notAssignedStudentsQueryDto: NotAssignedStudentsQueryDto,
  ) {
    return await this.studentsService.getNotAssignedStudents(
      pageOptionsDto,
      notAssignedStudentsQueryDto,
    );
  }
}
