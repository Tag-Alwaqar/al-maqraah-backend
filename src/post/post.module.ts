import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '@common/common.module';
import { UserModule } from '@user/user.module';
import { Post } from './entities/post.entity';
import { PostController } from './controllers/post.controller';
import { PostsService } from './services/post.service';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Post]), CommonModule],
  controllers: [PostController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostModule {}
