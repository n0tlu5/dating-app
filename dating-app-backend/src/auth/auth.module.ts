import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your_secret_key', // Use a secret from environment variables
      signOptions: { expiresIn: '1h' }, // Token expiration
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
