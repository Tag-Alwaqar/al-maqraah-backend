// import { User } from '@user/authentication/decorators/user.decorator';
// import { UserInfo } from '@user/authentication/dtos/v2/user-info.dto';
// import { AuthenticatedGuard } from '@user/authentication/guards/authenticated.guard';
// import { Authorize } from '@user/authorization/decorators/acl-guard.decorator';
// import { BlockUserDto } from '@user/dto/user/block-user.dto';
// import { CreateUserDto } from '@user/dto/user/create-user.dto';
// import {
//   UpdateUserDto,
//   UpdateProfileDto,
// } from '@user/dto/user/update-user.dto';
// import { Resources } from '@user/enums/resources.enum';
// import { UsersService } from '@user/services/user.service';
// import { DashboardController } from '@common/decorators/dashboard-controller.decorator';
// import { PageOptionsDto } from '@common/dtos/page-option.dto';
// import {
//   Body,
//   Controller,
//   Delete,
//   Get,
//   Param,
//   Patch,
//   Post,
//   Query,
//   UseGuards,
// } from '@nestjs/common';
// import { ApiTags } from '@nestjs/swagger';

// @ApiTags('user.users')
// @DashboardController('v2', 'users')
// @UseGuards(AuthenticatedGuard)
// export class UsersController {
//   constructor(private readonly usersService: UsersService) {}

//   @Authorize(Resources.User, 'create')
//   @Post()
//   async create(@User() userInfo: UserInfo, @Body() data: CreateUserDto) {
//     return await this.usersService.create(userInfo.id, data);
//   }

//   @Authorize(Resources.User, 'update')
//   @Patch()
//   async updateProfile(
//     @User() userInfo: UserInfo,
//     @Body() data: UpdateProfileDto,
//   ) {
//     return await this.usersService.update(userInfo.id, data, userInfo.id);
//   }

//   @Authorize(Resources.User, 'update')
//   @Patch(':id')
//   async update(
//     @User() userInfo: UserInfo,
//     @Param('id') id: number,
//     @Body() data: UpdateUserDto,
//   ) {
//     return await this.usersService.update(id, data, userInfo.id);
//   }

//   @Authorize(Resources.User, 'update')
//   @Patch(':id/block')
//   async blockUser(
//     @User() userInfo: UserInfo,
//     @Param('id') id: number,
//     @Body() data: BlockUserDto,
//   ) {
//     return await this.usersService.blockUser(
//       id,
//       userInfo.id,
//       data.is_blocked,
//     );
//   }

//   @Authorize(Resources.User, 'get')
//   @Get()
//   async findAll(
//     @Query() pageOptionsDto: PageOptionsDto,
//     @Query('text') text?: string | undefined,
//   ) {
//     return await this.usersService.findAll(pageOptionsDto, text);
//   }

//   @Authorize(Resources.User, 'get')
//   @Get(':id')
//   async findById(@Param('id') id: number) {
//     return await this.usersService.findOneById(id);
//   }

//   @Authorize(Resources.User, 'delete')
//   @Delete(':id')
//   async delete(@Param('id') id: number) {
//     return await this.usersService.delete(id);
//   }
// }
