import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { InMemoryUserRepository } from '../user/user.repository';
import { JwtAuthGuard } from './jwt-auth.guard';   // <-- import it

@Module({
  imports: [
    JwtModule.register({
      secret: 'CHANGE_ME_IN_PROD', // replace with env var in prod
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, InMemoryUserRepository, JwtAuthGuard],
  exports: [AuthService],
})
export class AuthModule {}