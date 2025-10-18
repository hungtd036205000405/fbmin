// src/posts/dto/update-post.dto.ts
export class UpdatePostDto {
  content?: string;    // Nội dung mới (không bắt buộc khi update)
  imageUrl?: string;   // Ảnh mới (không bắt buộc)
}