import { Injectable, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignupDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signup(signupDto: SignupDto): Promise<any> {
    const { username, password } = signupDto;

    // Check if the user already exists
    const existingUser = await this.usersService.findOne(username);
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    // Create the new user
    const user = await this.usersService.create({ username, password });
    return {
      id: user.id,
      username: user.username,
    };
  }
}
