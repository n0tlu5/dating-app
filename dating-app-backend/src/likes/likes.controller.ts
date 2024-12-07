import { Controller, Post, Param, UseGuards, Get } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LikesService } from './likes.service';

@Controller('likes')
@UseGuards(JwtAuthGuard)
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post(':userToId')
  async likeUser(@Param('userToId') userToId: number, @Param('userId') userId: number) {
    return this.likesService.likeUser(userId, userToId);
  }

  @Get('matches/:userId')
  async getMatches(@Param('userId') userId: number) {
    return this.likesService.getMatches(userId);
  }
}
