import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { User } from '../users/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            verifyPassword: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('should create a new user if username is not taken', async () => {
      const mockUser = { id: 1, username: 'testuser', password: 'hashedpassword' };
      jest.spyOn(usersService, 'findOne').mockResolvedValue(undefined); // No existing user
      jest.spyOn(usersService, 'create').mockResolvedValue(mockUser as User);

      const result = await service.signup({ username: 'testuser', password: 'securepassword' });

      expect(result).toEqual({ id: 1, username: 'testuser' });
      expect(usersService.findOne).toHaveBeenCalledWith('testuser');
      expect(usersService.create).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'securepassword',
      }); // Pass the object
    });

    it('should throw ConflictException if username already exists', async () => {
      const mockUser = { id: 1, username: 'testuser', password: 'hashedpassword' };
      jest.spyOn(usersService, 'findOne').mockResolvedValue(mockUser as User); // User already exists

      await expect(
        service.signup({ username: 'testuser', password: 'securepassword' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should return a JWT token if credentials are valid', async () => {
      const mockUser = { id: 1, username: 'testuser', password: 'hashedpassword' };
      jest.spyOn(usersService, 'findOne').mockResolvedValue(mockUser as User); // User exists
      jest.spyOn(usersService, 'verifyPassword').mockResolvedValue(true); // Password matches
      jest.spyOn(jwtService, 'sign').mockReturnValue('mock.jwt.token');

      const result = await service.login({ username: 'testuser', password: 'securepassword' });

      expect(result).toEqual({ accessToken: 'mock.jwt.token' });
      expect(usersService.findOne).toHaveBeenCalledWith('testuser');
      expect(usersService.verifyPassword).toHaveBeenCalledWith(
        'securepassword',
        'hashedpassword',
      );
      expect(jwtService.sign).toHaveBeenCalledWith({ username: 'testuser', sub: 1 });
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      jest.spyOn(usersService, 'findOne').mockResolvedValue(undefined); // User not found

      await expect(
        service.login({ username: 'testuser', password: 'securepassword' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
