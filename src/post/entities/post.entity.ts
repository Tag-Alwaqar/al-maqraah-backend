import { Column, Entity } from 'typeorm';
import { SoftDeletableEntity } from '@common/entities/soft-deletable.entity';
import { PostType } from '../enums/post.enum';

@Entity({ name: 'posts' })
export class Post extends SoftDeletableEntity {
  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'enum', enum: PostType })
  type: PostType;
}
