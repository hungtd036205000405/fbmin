// src/comments/dto/create-comment.dto.ts
export class CreateCommentDto {
  content: string;       // Nội dung bình luận (bắt buộc)
  postId: number;        // ID của bài viết (bắt buộc)
  authorId: number;      // ID của người bình luận (bắt buộc)
}