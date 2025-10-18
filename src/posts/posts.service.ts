// src/posts/posts.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepo: Repository<Post>,
    @InjectRepository(User) // 
    private userRepo: Repository<User>,
  ) {}

  // Tạo bài viết mới - NHẬN authorId TỪ DTO
  async create(createPostDto: CreatePostDto) {
    // BẢO ĐẢM authorId LÀ number
    const authorId = Number(createPostDto.authorId);
    if (!authorId || isNaN(authorId) || authorId <= 0) {
      throw new NotFoundException(`Invalid authorId: ${createPostDto.authorId}`);
    }

  // TÌM USER THEO authorId
  console.debug('CreatePostDto received:', createPostDto);
  const author = await this.userRepo.findOne({ where: { id: authorId } });// Tìm user theo authorId
  console.debug('Author found:', author);
    
    if (!author) {// Nếu không tìm thấy user, tức là authorId không hợp lệ
      throw new NotFoundException(`User with ID ${authorId} not found`);
    }

    const post = this.postRepo.create({
      content: createPostDto.content,
      imageUrl: createPostDto.imageUrl,
      author, // GÁN ĐÚNG USER TÌM ĐƯỢC
    });
    
    return await this.postRepo.save(post);
  }

  // Các method khác GIỮ NGUYÊN...
  async findAll(page: number = 1, limit: number = 10) {
    const [posts, total] = await this.postRepo.findAndCount({
      relations: ['author'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    
    return {
      posts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: ['author'],
    });
    
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    await this.postRepo.update(id, updatePostDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const post = await this.findOne(id);
    return await this.postRepo.remove(post);
  }

  async findByUser(userId: number) {
    return await this.postRepo.find({
      where: { author: { id: userId } },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }
}