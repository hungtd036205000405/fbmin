// src/comments/comments.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from '../users/entities/user.entity';
import { Post } from '../posts/entities/post.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepo: Repository<Comment>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Post)
    private postRepo: Repository<Post>,
  ) {}

  // Tạo bình luận mới
  async create(createCommentDto: CreateCommentDto) {
    // Tìm user (author)
    const author = await this.userRepo.findOne({ 
      where: { id: createCommentDto.authorId },
      select: ['id', 'name', 'email', 'avatar'] // Chỉ lấy những trường cần thiết để tối ưu khi hiển thị bình luận
    });
    
    if (!author) {
      throw new NotFoundException(`User with ID ${createCommentDto.authorId} not found`);
    }

    // Tìm post
    const post = await this.postRepo.findOne({ 
      where: { id: createCommentDto.postId } 
    });
    
    if (!post) {
      throw new NotFoundException(`Post with ID ${createCommentDto.postId} not found`);
    }

    // Tạo comment
    const comment = this.commentRepo.create({
      content: createCommentDto.content,
      post,
      author,
    });

    const savedComment = await this.commentRepo.save(comment);

    // Cập nhật commentsCount trong post
    await this.postRepo.update(post.id, {
      commentsCount: () => '"commentsCount" + 1' // Tăng commentsCount lên 1
    });

    // Load lại comment với đầy đủ thông tin
    return await this.commentRepo.findOne({
      where: { id: savedComment.id },
      relations: ['author', 'post'],
    });
  }

  // Lấy tất cả comments của một post
  async findByPost(postId: number, page: number = 1, limit: number = 10) {
    const [comments, total] = await this.commentRepo.findAndCount({
      where: { post: { id: postId } },
      relations: ['author'],
      select: {// chỉ lấy những trường cần thiết của author để tối ưu
        author: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        }
      },
      order: { createdAt: 'DESC' }, // Mới nhất trước
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      comments,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Lấy comment theo ID
  async findOne(id: number) {
    const comment = await this.commentRepo.findOne({
      where: { id },
      relations: ['author', 'post'],
      select: {
        author: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
        post: {
          id: true,
          content: true,
        }
      }
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  // Cập nhật comment
  async update(id: number, updateCommentDto: UpdateCommentDto) {
    const comment = await this.findOne(id);
    
    await this.commentRepo.update(id, updateCommentDto);
    
    // Load lại comment sau khi update
    return await this.findOne(id);
  }

  // Xóa comment
  async remove(id: number) {
    const comment = await this.findOne(id);
    const postId = comment.post.id;

    // Xóa comment
    await this.commentRepo.remove(comment);

    // Giảm commentsCount trong post
    await this.postRepo.update(postId, {
      commentsCount: () => '"commentsCount" - 1' // Giảm commentsCount đi 1
    });

    return { message: 'Comment deleted successfully' };
  }

  // Lấy tất cả comments của một user
  async findByUser(userId: number, page: number = 1, limit: number = 10) {
    const [comments, total] = await this.commentRepo.findAndCount({
      where: { author: { id: userId } },
      relations: ['author', 'post'],
      select: {
        author: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
        post: {
          id: true,
          content: true,
        }
      },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      comments,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}