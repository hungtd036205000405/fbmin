// src/comments/comments.controller.ts
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query 
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post() // POST /comments - Tạo bình luận mới
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }

  @Get('post/:postId') // GET /comments/post/1 - Lấy comments của post
  findByPost(
    @Param('postId') postId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return this.commentsService.findByPost(postId, page, limit);
  }

  @Get('user/:userId') // GET /comments/user/1 - Lấy comments của user
  findByUser(
    @Param('userId') userId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return this.commentsService.findByUser(userId, page, limit);
  }

  @Get(':id') // GET /comments/1 - Lấy comment theo ID
  findOne(@Param('id') id: number) {
    return this.commentsService.findOne(id);
  }

  @Patch(':id') // PATCH /comments/1 - Cập nhật comment
  update(@Param('id') id: number, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(id, updateCommentDto);
  }

  @Delete(':id') // DELETE /comments/1 - Xóa comment
  remove(@Param('id') id: number) {
    return this.commentsService.remove(id);
  }
}