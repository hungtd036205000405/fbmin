// src/posts/posts.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from './entities/post.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User])], // Đăng ký Post + User entity (cần để InjectRepository(User) hoạt động)
  controllers: [PostsController], // Đăng ký controller
  providers: [PostsService], // Đăng ký service
  exports: [PostsService], // Export service để module khác dùng
})
export class PostsModule {}