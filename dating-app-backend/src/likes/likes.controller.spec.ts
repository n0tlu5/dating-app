import { Test, TestingModule } from '@nestjs/testing';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Like } from './like.entity';
import { Match } from './match.entity';
import { User } from '../users/user.entity';

describe('LikesController', () => {
  let controller: LikesController;
  let service: LikesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LikesController],
      providers: [
        {
          provide: LikesService,
          useValue: {
            likeUser: jest.fn(),
            getMatches: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<LikesController>(LikesController);
    service = module.get<LikesService>(LikesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('likeUser', () => {
    it('should call service to like a user', async () => {
      const mockLike = { id: 1, userFrom: { id: 1 }, userTo: { id: 2 } };
      jest.spyOn(service, 'likeUser').mockResolvedValue(mockLike as Like);

      const result = await controller.likeUser({ user: { userId: 1 } }, 2);

      expect(result).toEqual(mockLike as Like);
      expect(service.likeUser).toHaveBeenCalledWith(1, 2);
    });
  });

  describe('getMatches', () => {
    it('should return matches for a user', async () => {
      const user1: User = {
        id: 1,
        username: 'User1',
        password: 'hashedPassword',
        isActive: true,
        sentLikes: [],
        receivedLikes: [],
        matches: [],
      };
      const user2: User = {
        id: 2,
        username: 'User2',
        password: 'hashedPassword',
        isActive: true,
        sentLikes: [],
        receivedLikes: [],
        matches: [],
      };
      const mockMatches : Match[] = [
        {
          id: 1,
          user1: user1,
          user2: user2,
          createdAt: new Date(),
        },
      ];

      // Mock `getMatches` to return the array of matches
      jest.spyOn(service, 'getMatches').mockResolvedValue(mockMatches as Match[]);

      const result = await controller.getMatches(1);

      expect(result).toEqual(mockMatches);
      expect(service.getMatches).toHaveBeenCalledWith(1);
    });
  });
});
