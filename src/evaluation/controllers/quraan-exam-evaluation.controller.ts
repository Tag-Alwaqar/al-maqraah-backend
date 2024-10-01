import { PageOptionsDto } from '@common/dtos/page-option.dto';
import { CreateQuraanExamEvaluationDto } from '@evaluation/dto/quraan-exam-evaluation/create-quraan-exam-evaluation.dto';
import { QuraanExamEvaluationDto } from '@evaluation/dto/quraan-exam-evaluation/quraan-exam-evaluation.dto';
import { QuraanExamEvaluationsQueryDto } from '@evaluation/dto/quraan-exam-evaluation/quraan-exam-evaluations-query.dto';
import { UpdateQuraanExamEvaluationDto } from '@evaluation/dto/quraan-exam-evaluation/update-quraan-exam-evaluation.dto';
import { QuraanExamEvaluationsService } from '@evaluation/services/quraan-exam-evaluation.service';
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
import { AdminAuth } from '@user/authentication/decorators/admin-auth.decorator';
import { UserAuth } from '@user/authentication/decorators/user-auth.decorator';
import { User } from '@user/authentication/decorators/user.decorator';

@ApiTags('Quraan Exam Evaluation')
@Controller('quraan-exam-evaluations')
export class QuraanExamEvaluationController {
  constructor(
    private readonly quraanExamEvaluationsService: QuraanExamEvaluationsService,
  ) {}

  @Get('')
  @UserAuth()
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query() quraanExamEvaluationsQueryDto: QuraanExamEvaluationsQueryDto,
    @User('id') callingUserId: number,
  ) {
    return await this.quraanExamEvaluationsService.findAll(
      pageOptionsDto,
      quraanExamEvaluationsQueryDto,
      callingUserId,
    );
  }

  @Get(':id')
  @UserAuth()
  async findById(@Param('id') id: string, @User('id') callingUserId: number) {
    const quraanExamEvaluation =
      await this.quraanExamEvaluationsService.findById(+id, callingUserId);

    return new QuraanExamEvaluationDto(quraanExamEvaluation);
  }

  @Post('')
  @AdminAuth()
  async create(@Body() data: CreateQuraanExamEvaluationDto) {
    const quraanExamEvaluation = await this.quraanExamEvaluationsService.create(
      data,
    );

    return new QuraanExamEvaluationDto(quraanExamEvaluation);
  }

  @Patch(':id')
  @AdminAuth()
  async update(
    @Param('id') id: string,
    @Body() data: UpdateQuraanExamEvaluationDto,
  ) {
    const quraanExamEvaluation =
      await this.quraanExamEvaluationsService.updateQuraanExamEvaluation(
        +id,
        data,
      );

    return new QuraanExamEvaluationDto(quraanExamEvaluation);
  }

  @Delete(':id')
  @AdminAuth()
  async delete(@Param('id') id: string) {
    await this.quraanExamEvaluationsService.delete(+id);

    return { message: 'تم حذف التقييم بنجاح' };
  }
}
