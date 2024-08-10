import { PageOptionsDto } from '@common/dtos/page-option.dto';
import { CreateExamEvaluationDto } from '@evaluation/dto/exam-evaluation/create-exam-evaluation.dto';
import { ExamEvaluationDto } from '@evaluation/dto/exam-evaluation/exam-evaluation.dto';
import { ExamEvaluationsQueryDto } from '@evaluation/dto/exam-evaluation/exam-evaluations-query.dto';
import { UpdateExamEvaluationDto } from '@evaluation/dto/exam-evaluation/update-exam-evaluation.dto';
import { ExamEvaluationsService } from '@evaluation/services/exam-evaluation.service';
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

@ApiTags('Exam Evaluation')
@Controller('exam-evaluations')
export class ExamEvaluationController {
  constructor(
    private readonly examEvaluationsService: ExamEvaluationsService,
  ) {}

  @Get('')
  @UserAuth()
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query() examEvaluationsQueryDto: ExamEvaluationsQueryDto,
    @User('id') callingUserId: number,
  ) {
    return await this.examEvaluationsService.findAll(
      pageOptionsDto,
      examEvaluationsQueryDto,
      callingUserId,
    );
  }

  @Get(':id')
  @UserAuth()
  async findById(@Param('id') id: string, @User('id') callingUserId: number) {
    const examEvaluation = await this.examEvaluationsService.findById(
      +id,
      callingUserId,
    );

    return new ExamEvaluationDto(examEvaluation);
  }

  @Post('')
  @AdminAuth()
  async create(@Body() data: CreateExamEvaluationDto) {
    const examEvaluation = await this.examEvaluationsService.create(data);

    return new ExamEvaluationDto(examEvaluation);
  }

  @Patch(':id')
  @AdminAuth()
  async update(@Param('id') id: string, @Body() data: UpdateExamEvaluationDto) {
    const examEvaluation =
      await this.examEvaluationsService.updateExamEvaluation(+id, data);

    return new ExamEvaluationDto(examEvaluation);
  }

  @Delete(':id')
  @AdminAuth()
  async delete(@Param('id') id: string) {
    await this.examEvaluationsService.delete(+id);

    return { message: 'تم حذف التقييم بنجاح' };
  }
}
