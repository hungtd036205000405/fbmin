// src/comments/entities/comment.entity.ts
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  CreateDateColumn, 
  UpdateDateColumn 
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Post } from '../../posts/entities/post.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string; // Nội dung bình luận

  // QUAN HỆ: NHIỀU COMMENTS THUỘC VỀ 1 POST
  @ManyToOne(() => Post, (post) => post.comments, { 
    onDelete: 'CASCADE' // Xóa post thì xóa luôn comments
  })
  post: Post;

  // QUAN HỆ: NHIỀU COMMENTS THUỘC VỀ 1 USER (author)
  @ManyToOne(() => User, (user) => user.comments, { 
    onDelete: 'CASCADE' // Xóa user thì xóa luôn comments
  })
  author: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}