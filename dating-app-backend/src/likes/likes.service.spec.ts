import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { LikesService } from './likes.service';
import { Like } from './like.entity';
import { Match } from './match.entity';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

describe('LikesService', () => {
  let service: LikesService;
  let likeRepository: Repository<Like>;
  let matchRepository: Repository<Match>;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LikesService,
        {
          provide: getRepositoryToken(Like),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Match),
          useValue: {
            save: jest.fn(),
            create: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findOneById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LikesService>(LikesService);
    likeRepository = module.get<Repository<Like>>(getRepositoryToken(Like));
    matchRepository = module.get<Repository<Match>>(getRepositoryToken(Match));
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('likeUser', () => {
    it('should create a like and check for mutual likes', async () => {
      const userFromId = 1;
      const userToId = 2;

      const userFrom: DeepPartial<User> = { id: userFromId, username: 'User1' };
      const userTo: DeepPartial<User> = { id: userToId, username: 'User2' };

      // Mock `findOneById` to return users
      jest.spyOn(usersService, 'findOneById').mockResolvedValueOnce(userFrom as User);
      jest.spyOn(usersService, 'findOneById').mockResolvedValueOnce(userTo as User);

      // Mock `findOne` to simulate no existing like
      jest.spyOn(likeRepository, 'findOne').mockResolvedValue(null);

      // Mock `create` to return a like object
      jest.spyOn(likeRepository, 'create').mockImplementation((like) => ({
        id: 1,
        ...like,
        createdAt: new Date(),
      } as Like));

      // Mock `save` to simulate saving the like
      jest.spyOn(likeRepository, 'save').mockResolvedValue({
        id: 1,
        userFrom: userFrom as User,
        userTo: userTo as User,
        createdAt: new Date(),
      });

      // Mock `create` for mutual match
      jest.spyOn(matchRepository, 'create').mockImplementation((match) => ({
        id: 1,
        ...match,
        createdAt: new Date(),
      } as Match));

      // Mock `save` for mutual match
      jest.spyOn(matchRepository, 'save').mockResolvedValue({
        id: 1,
        user1: userFrom as User,
        user2: userTo as User,
        createdAt: new Date(),
      });

      const result = await service.likeUser(userFromId, userToId);

      expect(result).toEqual({
        id: 1,
        userFrom: userFrom as User,
        userTo: userTo as User,
        createdAt: expect.any(Date),
      });

      expect(usersService.findOneById).toHaveBeenCalledTimes(2);
      expect(likeRepository.save).toHaveBeenCalled();
    });

    it('should throw an error if a like already exists', async () => {
      const userFromId = 1;
      const userToId = 2;

      // Define mock user data
      const userFrom: DeepPartial<User> = {
        id: userFromId,
        username: 'User1',
        password: 'hashedPassword',
        isActive: true,
        sentLikes: [],
        receivedLikes: [],
        matches: [],
      };

      const userTo: DeepPartial<User> = {
        id: userToId,
        username: 'User2',
        password: 'hashedPassword',
        isActive: true,
        sentLikes: [],
        receivedLikes: [],
        matches: [],
      };

      // Mock `likeRepository` to simulate an existing like
      jest.spyOn(likeRepository, 'findOne').mockResolvedValue({
        id: 1,
        userFrom: userFrom as User, // Cast to User
        userTo: userTo as User, // Cast to User
        createdAt: new Date(),
      });

      await expect(service.likeUser(userFromId, userToId)).rejects.toThrow(
        'You have already liked this user.',
      );
    });
  });

  describe('getMatches', () => {
    it('should return matches for a user', async () => {
      const userId = 1;

      // Define mock user data
      const user1: User = {
        id: userId,
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

      // Mock `matchRepository.find` to return matches
      jest.spyOn(matchRepository, 'find').mockResolvedValue([
        {
          id: 1,
          user1,
          user2,
          createdAt: new Date(),
        },
      ]);

      const result = await service.getMatches(userId);

      expect(result).toEqual([
        {
          id: 1,
          user1,
          user2,
          createdAt: expect.any(Date),
        },
      ]);

      expect(matchRepository.find).toHaveBeenCalledWith({
        where: [{ user1: { id: userId } }, { user2: { id: userId } }],
        relations: ['user1', 'user2'],
      });
    });
  });
});
