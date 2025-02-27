import { PageOptionsDto } from '@common/dtos/page-option.dto';
import { CreateFeesDto } from '@fees/dto/create-fees.dto';
import { FeesQueryDto } from '@fees/dto/fees-query.dto';
import { FeesDto } from '@fees/dto/fees.dto';
import { UpdateFeesDto } from '@fees/dto/update-fees.dto';
import { FeesService } from '@fees/services/fees.service';
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
import { UsersService } from '@user/services/user.service';

@ApiTags('Fees')
@Controller('fees')
export class FeesController {
  constructor(
    private readonly feesService: FeesService,
    private readonly usersService: UsersService,
  ) {}

  @Get('')
  @UserAuth()
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query() feesQueryDto: FeesQueryDto,
    @User('id') callingUserId: number,
  ) {
    return await this.feesService.findAll(
      pageOptionsDto,
      feesQueryDto,
      callingUserId,
    );
  }

  @Get(':id')
  @AdminAuth()
  async findById(@Param('id') id: string, @User('id') callingUserId: number) {
    const fees = await this.feesService.findById(+id, callingUserId);

    return new FeesDto(fees);
  }

  @Post('')
  @AdminAuth()
  async create(@Body() data: CreateFeesDto, @User('id') userId: number) {
    const admin = await this.usersService.findOneById(userId);

    const fees = await this.feesService.create(data, admin);

    return new FeesDto(fees);
  }

  @Patch(':id')
  @AdminAuth()
  async update(
    @Param('id') id: string,
    @Body() data: UpdateFeesDto,
    @User('id') callingUserId: number,
  ) {
    const fees = await this.feesService.updateFees(+id, data, callingUserId);

    return new FeesDto(fees);
  }

  @Delete(':id')
  @AdminAuth()
  async delete(@Param('id') id: string, @User('id') callingUserId: number) {
    await this.feesService.delete(+id, callingUserId);

    return { message: 'تم حذف التقييم بنجاح' };
  }
}
