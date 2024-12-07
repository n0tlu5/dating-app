import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from Authorization header
      ignoreExpiration: false, // Do not allow expired tokens
      secretOrKey: process.env.JWT_SECRET || 'your_secret_key', // Secret for verifying token
    });
  }

  async validate(payload: any) {
    // The payload contains information such as username and sub (userId)
    return { userId: payload.sub, username: payload.username };
  }
}
