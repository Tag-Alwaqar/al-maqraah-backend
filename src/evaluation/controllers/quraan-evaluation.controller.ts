import { PageOptionsDto } from '@common/dtos/page-option.dto';
import { EvaluationsQueryDto } from '@evaluation/dto/evaluation/evaluations-query.dto';
import { CreateQuraanEvaluationDto } from '@evaluation/dto/quraan-evaluation/create-quraan-evaluation.dto';
import { QuraanEvaluationDto } from '@evaluation/dto/quraan-evaluation/quraan-evaluation.dto';
import { QuraanEvaluationsService } from '@evaluation/services/quraan-evaluation.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TeacherAuth } from '@user/authentication/decorators/teacher-auth.decorator';
import { UserAuth } from '@user/authentication/decorators/user-auth.decorator';
import { User } from '@user/authentication/decorators/user.decorator';
import { UsersService } from '@user/services/user.service';

@ApiTags('Quraan Evaluation')
@Controller('quraan-evaluations')
export class QuraanEvaluationController {
  constructor(
    private readonly quraanEvaluationsService: QuraanEvaluationsService,
    private readonly usersService: UsersService,
  ) {}

  @Get('')
  @UserAuth()
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query() evaluationsQueryDto: EvaluationsQueryDto,
    @User('id') callingUserId: number,
  ) {
    return await this.quraanEvaluationsService.findAll(
      pageOptionsDto,
      evaluationsQueryDto,
      callingUserId,
    );
  }

  @Get(':id')
  @UserAuth()
  async findById(@Param('id') id: string, @User('id') callingUserId: number) {
    const quraanEvaluation = await this.quraanEvaluationsService.findById(
      +id,
      callingUserId,
    );

    return new QuraanEvaluationDto(quraanEvaluation);
  }

  @Post('')
  @TeacherAuth()
  async create(
    @Body() data: CreateQuraanEvaluationDto,
    @User('id') userId: number,
  ) {
    const quraanEvaluation = await this.quraanEvaluationsService.create(
      data,
      userId,
    );

    return new QuraanEvaluationDto(quraanEvaluation);
  }

  @Delete(':id')
  @UserAuth()
  async delete(@Param('id') id: string, @User('id') userId: number) {
    await this.quraanEvaluationsService.delete(+id, userId);

    return { message: 'تم حذف التقييم بنجاح' };
  }
}
