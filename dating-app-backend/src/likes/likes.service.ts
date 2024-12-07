import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './like.entity';
import { Match } from './match.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    private readonly usersService: UsersService,
  ) {}

  async likeUser(userFromId: number, userToId: number): Promise<Like> {
    if (userFromId === userToId) {
      throw new Error('You cannot like yourself.');
    }

    // Check if the user has already liked the target user
    const existingLike = await this.likeRepository.findOne({
      where: { userFrom: { id: userFromId }, userTo: { id: userToId } },
    });

    if (existingLike) {
      throw new Error('You have already liked this user.');
    }

    // Create a new like
    const newLike = this.likeRepository.create({
      userFrom: await this.usersService.findOneById(userFromId),
      userTo: await this.usersService.findOneById(userToId),
    });
    await this.likeRepository.save(newLike);

    // Check if a match exists
    const mutualLike = await this.likeRepository.findOne({
      where: { userFrom: { id: userToId }, userTo: { id: userFromId } },
    });

    if (mutualLike) {
      await this.createMatch(userFromId, userToId);
    }

    return newLike;
  }

  private async createMatch(user1Id: number, user2Id: number): Promise<Match> {
    const newMatch = this.matchRepository.create({
      user1: await this.usersService.findOneById(user1Id),
      user2: await this.usersService.findOneById(user2Id),
    });
    return this.matchRepository.save(newMatch);
  }

  async getMatches(userId: number): Promise<Match[]> {
    return this.matchRepository.find({
      where: [{ user1: { id: userId } }, { user2: { id: userId } }],
      relations: ['user1', 'user2'],
    });
  }
}
