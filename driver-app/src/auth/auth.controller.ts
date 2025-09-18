import {
  Body,
  Controller,
  Post,
  HttpCode,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRole } from '../user/user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';   // defined below

class RegisterDto {
  username: string;
  password: string;
  name: string;
  role: UserRole;
  email: string;
}

class LoginDto {
  username: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.auth.register(dto);
    // omit passwordHash from response
    const { passwordHash, ...rest } = user;
    return rest;
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.auth.validateCredentials(dto.username, dto.password);
    return this.auth.login(user);
  }

  // Example of a protected route that returns the logged‑in user
  @UseGuards(JwtAuthGuard)
  @Post('me')
  me(@Request() req) {
    return req.user; // populated by guard
  }
}