import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { Post } from '../posts/entities/post.entity';
import { Comment } from '../comments/entities/comment.entity';

export const databaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('DB_HOST') || 'localhost',
  port: Number(configService.get('DB_PORT')) || 5432,
  username: configService.get('DB_USERNAME') || 'postgres',
  // Avoid String(undefined) which becomes the literal 'undefined'.
  // Use nullish coalescing so missing env yields an empty string.
  password: configService.get<string>('DB_PASSWORD') ?? '',
  database: configService.get('DB_NAME') || 'facebook_mini',
  entities: [User, Post, Comment],
  synchronize: true, // ⚠️ chỉ bật khi dev, không nên bật khi deploy
  logging: true,
});
