// src/auth/jwt-auth.guard.ts
import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { InMemoryUserRepository } from '../user/user.repository';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly jwt: JwtService,
    private readonly usersRepo: InMemoryUserRepository,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;
    if (!authHeader) throw new UnauthorizedException('Missing token');

    const [, token] = authHeader.split(' ');
    const payload = this.jwt.verify(token, { ignoreExpiration: false }) as any;

    const user = await this.usersRepo.findById(payload.sub);
    if (!user) throw new UnauthorizedException('User not found');

    // Attach the full user object so controllers can read `req.user`
    request.user = user;
    return true;
  }
}