// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    //  Nạp ConfigModule để đọc file .env
    ConfigModule.forRoot({
      isGlobal: true, // Cho phép dùng ConfigService ở mọi nơi
      // Load .env from project root and src/.env (some projects keep env in src)
      envFilePath: ['.env', 'src/.env'],
    }),

    //  Kết nối TypeORM (sử dụng databaseConfig và ConfigService) để map vào các entity
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: databaseConfig,
      inject: [ConfigService],
    }),

    //  Các module khác
    UsersModule,
    PostsModule,
    AuthModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
