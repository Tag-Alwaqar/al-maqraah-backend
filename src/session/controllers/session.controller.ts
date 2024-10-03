import { PageOptionsDto } from '@common/dtos/page-option.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserAuth } from '@user/authentication/decorators/user-auth.decorator';
import { User } from '@user/authentication/decorators/user.decorator';
import { SessionsService } from '../services/session.service';
import { SessionsQueryDto } from '../dto/sessions-query.dto';
import { SessionDto } from '../dto/session.dto';
import { CreateSessionDto } from '../dto/create-session.dto';
import { UpdateSessionDto } from '../dto/update-session.dto';
import { TeacherAuth } from '@user/authentication/decorators/teacher-auth.decorator';
import { SessionsStatsQueryDto } from '@session/dto/sessions-stats-query.dto';
import { SessionsGroupStatsQueryDto } from '@session/dto/sessions-group-stats-query.dto';
import { AdminAuth } from '@user/authentication/decorators/admin-auth.decorator';

@ApiTags('Session')
@Controller('sessions')
export class SessionController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get('')
  @UserAuth()
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query() sessionsQueryDto: SessionsQueryDto,
    @User('id') callingUserId: number,
  ) {
    return await this.sessionsService.findAll(
      pageOptionsDto,
      sessionsQueryDto,
      callingUserId,
    );
  }

  @Get('stats')
  @AdminAuth()
  async stats(
    @Query() sessionsStatsQueryDto: SessionsStatsQueryDto,
    @User('id') callingUserId: number,
  ) {
    return await this.sessionsService.stats(
      callingUserId,
      sessionsStatsQueryDto,
    );
  }

  @Get(':groupId/groupStats')
  @UserAuth()
  async groupStats(
    @Param('groupId') groupId: string,
    @User('id') callingUserId: number,
    @Query() data: SessionsGroupStatsQueryDto,
  ) {
    return await this.sessionsService.groupStats(+groupId, callingUserId, data);
  }

  @Get(':id')
  @UserAuth()
  async findById(@Param('id') id: string, @User('id') callingUserId: number) {
    const session = await this.sessionsService.findById(+id, callingUserId);

    return new SessionDto(session);
  }

  @Post('')
  @TeacherAuth()
  async create(@Body() data: CreateSessionDto, @User('id') userId: number) {
    const session = await this.sessionsService.create(data, userId);

    return new SessionDto(session);
  }

  @Patch(':id')
  @UserAuth()
  async update(
    @Param('id') id: string,
    @Body() data: UpdateSessionDto,
    @User('id') userId: number,
  ) {
    const session = await this.sessionsService.updateSession(+id, data, userId);

    return new SessionDto(session);
  }

  @Delete(':id')
  @UserAuth()
  async delete(@Param('id') id: string, @User('id') userId: number) {
    await this.sessionsService.delete(+id, userId);

    return { message: 'تم حذف الحلقة بنجاح' };
  }
}
