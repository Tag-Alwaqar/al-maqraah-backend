import { PageOptionsDto } from '@common/dtos/page-option.dto';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserAuth } from '@user/authentication/decorators/user-auth.decorator';
import { User } from '@user/authentication/decorators/user.decorator';
import { StudentsService } from '@user/services/student.service';

@ApiTags('Student')
@Controller('students')
export class StudentController {
  constructor(private readonly studentsService: StudentsService) {}
  @Get('groups/:id')
  @UserAuth()
  async getGroupStudents(
    @Query() pageOptionsDto: PageOptionsDto,
    @Param('id') groupId: string,
    @User('id') callingUserId: number,
  ) {
    return await this.studentsService.getGroupStudents(
      pageOptionsDto,
      +groupId,
      callingUserId,
    );
  }
}
