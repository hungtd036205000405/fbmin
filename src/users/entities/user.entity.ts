// src/users/entities/user.entity.ts
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  OneToMany,
  BeforeInsert,
  BeforeUpdate
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Post } from '../../posts/entities/post.entity';
import { Comment } from '../../comments/entities/comment.entity';
//import { Like } from '../../likes/entities/like.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ nullable: true })
  bio?: string;

  @Column({ default: 0 })
  postsCount: number;

  @Column({ default: 0 })
  friendsCount: number;

  // ✅ SỬA THÀNH: Cho phép null và undefined
  @Column({ nullable: true, type: 'varchar' })
  refreshToken?: string | null;

  // Quan hệ
  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  // @OneToMany(() => Like, (like) => like.user)
  // likes: Like[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  //  PHƯƠNG THỨC MÃ HÓA PASSWORD
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      // Chỉ hash nếu password thay đổi
      this.password = await bcrypt.hash(this.password, 12);
    }
  }

  //  PHƯƠNG THỨC KIỂM TRA PASSWORD
  async validatePassword(password: string): Promise<boolean> {// password là tham số đầu vào (chưa mã hóa)
    return await bcrypt.compare(password, this.password);
  }

  //  PHƯƠNG THỨC ẨN PASSWORD TRONG RESPONSE
  toJSON() {
    const { password, refreshToken, ...user } = this;
    return user;
  }
}