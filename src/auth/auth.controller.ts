// src/auth/auth.controller.ts
import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)// chỉ cho phép truy cập khi đã xác thực
  async logout(@Req() req) {
    return this.authService.logout(req.user.id);
  }

  @Post('refresh')
  async refreshTokens(@Body('refreshToken') refreshToken: string) {
    // Trong thực tế, nên verify token trước để lấy userId
    // Ở đây tạm thời để đơn giản
    const payload = this.authService['jwtService'].decode(refreshToken);
    return this.authService.refreshTokens(payload.sub, refreshToken);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)// chỉ cho phép truy cập khi đã xác thực
  getProfile(@Req() req) {
    return req.user;
  }
}