import { Post } from '../entities/post.entity';
import { PostType } from '../enums/post.enum';

export class PostDto {
  id: number;
  created_at: Date;
  updated_at: Date;
  title: string;
  content: string;
  type: PostType;
  constructor(post: Post) {
    this.id = post.id;
    this.created_at = post.created_at;
    this.updated_at = post.updated_at;
    this.title = post.title;
    this.content = post.content;
    this.type = post.type;
  }
}
