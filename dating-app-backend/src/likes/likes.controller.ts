import { Controller, Request, Post, Param, UseGuards, Get } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LikesService } from './likes.service';

@Controller('likes')
@UseGuards(JwtAuthGuard)
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post(':userToId')
  async likeUser(@Request() req: any, @Param('userToId') userToId: number) {
    const userFromId = req.user.userId; // Extract the logged-in user's ID from the JWT payload
    return this.likesService.likeUser(userFromId, userToId);
  }

  @Get('matches/:userId')
  async getMatches(@Param('userId') userId: number) {
    return this.likesService.getMatches(userId);
  }
}
