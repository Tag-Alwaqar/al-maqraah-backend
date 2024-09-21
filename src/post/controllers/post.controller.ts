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
import { PostsService } from '../services/post.service';
import { AdminAuth } from '@user/authentication/decorators/admin-auth.decorator';
import { PostsQueryDto } from '../dto/posts-query.dto';
import { PostDto } from '../dto/post.dto';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';

@ApiTags('Post')
@Controller('posts')
export class PostController {
  constructor(private readonly postsService: PostsService) {}

  @Get('')
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query() postsQueryDto: PostsQueryDto,
  ) {
    return await this.postsService.findAll(pageOptionsDto, postsQueryDto);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const post = await this.postsService.findById(+id);

    return new PostDto(post);
  }

  @Post('')
  @AdminAuth()
  async create(@Body() data: CreatePostDto) {
    const post = await this.postsService.create(data);

    return new PostDto(post);
  }

  @Patch(':id')
  @AdminAuth()
  async update(@Param('id') id: string, @Body() data: UpdatePostDto) {
    const post = await this.postsService.updatePost(+id, data);

    return new PostDto(post);
  }

  @Delete(':id')
  @AdminAuth()
  async delete(@Param('id') id: string) {
    await this.postsService.delete(+id);

    return { message: 'تم حذف المنشور بنجاح' };
  }
}
