// src/auth/auth.service.ts
import { 
  Injectable, 
  UnauthorizedException, 
  ConflictException,
  BadRequestException 
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // ĐĂNG KÝ
  async register(registerDto: RegisterDto) {
    // Kiểm tra password match
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Kiểm tra email tồn tại
    const existingUser = await this.userRepo.findOne({
      where: { email: registerDto.email }
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Tạo user mới
    const user = this.userRepo.create({
      name: registerDto.name,
      email: registerDto.email,
      password: registerDto.password, // Sẽ tự động hash trong entity
    });

    const savedUser = await this.userRepo.save(user);

    // Tạo tokens
    const tokens = await this.generateTokens(savedUser.id, savedUser.email);

    // Lưu refresh token
    await this.updateRefreshToken(savedUser.id, tokens.refreshToken);

    return {
      user: savedUser,
      ...tokens
    };
  }

  //  ĐĂNG NHẬP
  async login(loginDto: LoginDto) {
    // Tìm user bằng email
    const user = await this.userRepo.findOne({
      where: { email: loginDto.email },
      select: ['id', 'email', 'password', 'name', 'avatar', 'isActive']
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Kiểm tra password
    const isPasswordValid = await user.validatePassword(loginDto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Kiểm tra tài khoản active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Tạo tokens
    const tokens = await this.generateTokens(user.id, user.email);

    // Lưu refresh token
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    // Ẩn password trong response
    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      ...tokens
    };
  }

  //  ĐĂNG XUẤT
  async logout(userId: number) {
    // Xóa refresh token
    await this.userRepo.update(userId, { refreshToken: null });
    return { message: 'Logged out successfully' };
  }

  //  REFRESH TOKEN
  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: ['id', 'email', 'refreshToken']
    });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Kiểm tra refresh token
    const isRefreshTokenValid = refreshToken === user.refreshToken;
    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Tạo tokens mới
    const tokens = await this.generateTokens(user.id, user.email);

    // Cập nhật refresh token mới
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  // ✅ TẠO ACCESS & REFRESH TOKENS
  private async generateTokens(userId: number, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '15m' }
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' }
      ),
    ]);

    return { accessToken, refreshToken };
  }

  // ✅ CẬP NHẬT REFRESH TOKEN
  private async updateRefreshToken(userId: number, refreshToken: string) {
    await this.userRepo.update(userId, { refreshToken });
  }

  // ✅ VALIDATE USER (Dùng cho Local Strategy)
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepo.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'name', 'avatar', 'isActive']
    });

    if (user && (await user.validatePassword(password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}