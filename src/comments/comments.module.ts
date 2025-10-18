// src/comments/comments.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Comment } from './entities/comment.entity';
import { User } from '../users/entities/user.entity';
import { Post } from '../posts/entities/post.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, User, Post]), // đăng ký các entity dùng trong module
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService], // nếu cần dùng trong module khác
})
export class CommentsModule {}
