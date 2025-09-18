//driver-app/src/auth/auth.servics.ts
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InMemoryUserRepository } from '../user/user.repository';
import { User, UserRole } from '../user/user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepo: InMemoryUserRepository,
    private readonly jwt: JwtService,
  ) {}

  // ---------- Registration ----------
  async register(payload: {
    username: string;
    password: string;
    name: string;
    role: UserRole;
    email: string;
    // optional fields omitted for brevity
  }): Promise<User> {
    // enforce unique username/email
    if (await this.usersRepo.findByUsername(payload.username)) {
      throw new ConflictException('Username already taken');
    }
    if (await this.usersRepo.findByEmail(payload.email)) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(payload.password, 10);
    const user = await this.usersRepo.create({
      username: payload.username,
      passwordHash,
      name: payload.name,
      role: payload.role,
      email: payload.email,
      bio: '',
      address: '',
      phone: '',
      profilePicUrl: '',
      backupEmail: '',
      securityQuestion: '',
      points: 0,
      archived: false,
    });

    return user;
  }

  // ---------- Login ----------
  async validateCredentials(username: string, password: string): Promise<User> {
    const user = await this.usersRepo.findByUsername(username);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    if (user.archived) throw new UnauthorizedException('Account archived');

    return user;
  }

  async login(user: User) {
    const payload = { sub: user.id, role: user.role };
    return {
      access_token: this.jwt.sign(payload),
    };
  }
}