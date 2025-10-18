// src/posts/entities/post.entity.ts
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  OneToMany, 
  ManyToOne, 
  CreateDateColumn, 
  UpdateDateColumn 
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Comment } from '../../comments/entities/comment.entity'; // ✅ THÊM IMPORT
// import { Like } from '../../likes/entities/like.entity'; // ✅ THÊM IMPORT

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')  // Dùng 'text' thay vì string để chứa nội dung dài
  content: string;

  @Column({ nullable: true })// @Column nghĩa là cột bình thường trong bảng
  imageUrl?: string;

  //  QUAN HỆ VỚI USER:   NHIỀU BÀI VIẾT THUỘC VỀ 1 NGƯỜI DÙNG
  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  author: User;

  //  QUAN HỆ VỚI COMMENTS: 1 POST CÓ NHIỀU COMMENTS
  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  // ✅ QUAN HỆ VỚI LIKES: 1 POST CÓ NHIỀU LIKES
//   @OneToMany(() => Like, (like) => like.post)
//   likes: Like[];

  // ✅ THÊM COUNTERS ĐỂ TỐI ƯU PERFORMANCE - KHÔNG CẦN COUNT MỖI LẦN
  @Column({ default: 0 })
  likesCount: number; // Số lượt like

  @Column({ default: 0 })
  commentsCount: number; // Số bình luận

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}