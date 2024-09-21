import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { PostType } from '../enums/post.enum';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsEnum(PostType)
  type: PostType;
}
