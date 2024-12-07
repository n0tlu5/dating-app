import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository, // Mock TypeORM repository
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const mockUser = { id: 1, username: 'testuser', password: 'hashedPassword' };
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser as User);

      const result = await service.findOne('testuser');
      expect(result).toEqual(mockUser);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { username: 'testuser' } });
    });

    it('should return undefined if user not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

      const result = await service.findOne('unknownuser');
      expect(result).toBeUndefined();
    });
  });

  describe('create', () => {
    it('should create and save a new user', async () => {
      const createUserDto = { username: 'testuser', password: 'securepassword' };
      const mockUser = { id: 1, ...createUserDto, password: 'hashedPassword' };

      jest.spyOn(userRepository, 'create').mockReturnValue(mockUser as User);
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser as User);

      const result = await service.create(createUserDto);
      expect(result).toEqual(mockUser);
      expect(userRepository.create).toHaveBeenCalledWith({
        username: 'testuser',
        password: expect.any(String),
      });
      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
    });
  });
});
