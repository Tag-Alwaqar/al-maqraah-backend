import { PageOptionsDto } from '@common/dtos/page-option.dto';
import { EvaluationsQueryDto } from '@evaluation/dto/evaluation/evaluations-query.dto';
import { CreateShariaEvaluationDto } from '@evaluation/dto/sharia-evaluation/create-sharia-evaluation.dto';
import { ShariaEvaluationDto } from '@evaluation/dto/sharia-evaluation/sharia-evaluation.dto';
import { UpdateShariaEvaluationDto } from '@evaluation/dto/sharia-evaluation/update-sharia-evaluation.dto';
import { ShariaEvaluationsService } from '@evaluation/services/sharia-evaluation.service';
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
import { TeacherAuth } from '@user/authentication/decorators/teacher-auth.decorator';
import { UserAuth } from '@user/authentication/decorators/user-auth.decorator';
import { User } from '@user/authentication/decorators/user.decorator';
import { UsersService } from '@user/services/user.service';

@ApiTags('Sharia Evaluation')
@Controller('sharia-evaluations')
export class ShariaEvaluationController {
  constructor(
    private readonly shariaEvaluationsService: ShariaEvaluationsService,
    private readonly usersService: UsersService,
  ) {}

  @Get('')
  @UserAuth()
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query() evaluationsQueryDto: EvaluationsQueryDto,
    @User('id') callingUserId: number,
  ) {
    return await this.shariaEvaluationsService.findAll(
      pageOptionsDto,
      evaluationsQueryDto,
      callingUserId,
    );
  }

  @Get(':id')
  @UserAuth()
  async findById(@Param('id') id: string, @User('id') callingUserId: number) {
    const shariaEvaluation = await this.shariaEvaluationsService.findById(
      +id,
      callingUserId,
    );

    return new ShariaEvaluationDto(shariaEvaluation);
  }

  @Post('')
  @TeacherAuth()
  async create(
    @Body() data: CreateShariaEvaluationDto,
    @User('id') userId: number,
  ) {
    const shariaEvaluation = await this.shariaEvaluationsService.create(
      data,
      userId,
    );

    return new ShariaEvaluationDto(shariaEvaluation);
  }

  @Patch(':id')
  @UserAuth()
  async update(
    @Param('id') id: string,
    @Body() data: UpdateShariaEvaluationDto,
    @User('id') userId: number,
  ) {
    const shariaEvaluation =
      await this.shariaEvaluationsService.updateShariaEvaluation(
        +id,
        data,
        userId,
      );

    return new ShariaEvaluationDto(shariaEvaluation);
  }

  @Delete(':id')
  @UserAuth()
  async delete(@Param('id') id: string, @User('id') userId: number) {
    await this.shariaEvaluationsService.delete(+id, userId);

    return { message: 'تم حذف التقييم بنجاح' };
  }
}
