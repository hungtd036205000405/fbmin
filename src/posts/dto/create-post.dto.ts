// src/posts/dto/create-post.dto.ts
export class CreatePostDto {
  content: string;     // Nội dung bài viết (bắt buộc)
  imageUrl?: string;   // Ảnh đính kèm (không bắt buộc)
  authorId: number;  // ID người tạo bài viết (bắt buộc)
}