import { PageOptionsDto } from '@common/dtos/page-option.dto';
import { PaginationService } from '@common/pagination.service';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isDefined } from 'class-validator';
import { UsersService } from '@user/services/user.service';
import { Post } from '../entities/post.entity';
import { CreatePostDto } from '../dto/create-post.dto';
import { PostsQueryDto } from '../dto/posts-query.dto';
import { PostDto } from '../dto/post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    private readonly paginationService: PaginationService,
    private readonly usersService: UsersService,
  ) {}

  async create(data: CreatePostDto) {
    const post = this.postsRepository.create(data);
    return await this.postsRepository.save(post);
  }

  async findAll(pageOptionsDto: PageOptionsDto, postsQuery: PostsQueryDto) {
    const query = this.postsRepository.createQueryBuilder('post');

    if (isDefined(postsQuery.search)) {
      query.andWhere(
        '(post.title ILIKE :search OR post.content ILIKE :search)',
        {
          search: `%${postsQuery.search}%`,
        },
      );
    }

    if (isDefined(postsQuery.type))
      query.andWhere('post.type = :type', {
        type: postsQuery.type,
      });

    query.orderBy('post.title', 'ASC').addOrderBy('post.created_at', 'DESC');

    return this.paginationService.paginate({
      pageOptionsDto,
      query,
      mapToDto: async (posts: Post[]) => posts.map((post) => new PostDto(post)),
    });
  }

  async findOneById(id: number): Promise<Post | null> {
    return await this.postsRepository.findOne({
      where: { id },
    });
  }

  async findById(id: number): Promise<Post> {
    const post = await this.findOneById(id);

    if (!post) {
      throw new NotFoundException('هذا المنشور غير موجود');
    }

    return post;
  }

  async update(post: Post) {
    return await this.postsRepository.save(post);
  }

  async updatePost(id: number, data: UpdatePostDto) {
    const post = await this.findOneById(id);

    if (!post) {
      throw new NotFoundException('هذا المنشور غير موجود');
    }

    Object.keys(data).forEach((key) => {
      if (isDefined(data[key])) {
        post[key] = data[key];
      }
    });

    return await this.update(post);
  }

  async delete(id: number) {
    const post = await this.postsRepository.findOne({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('هذا المنشور غير موجود');
    }

    await this.postsRepository.delete(id);
  }
}
