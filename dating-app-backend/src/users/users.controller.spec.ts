import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findOneById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getLoggedInUserProfile', () => {
    it('should return the logged-in user profile when authenticated', async () => {
      const mockUser = { id: 1, username: 'testuser', isActive: true };

      // Mock the service method
      jest.spyOn(service, 'findOneById').mockResolvedValue(mockUser as User);

      const mockRequest = { user: { userId: 1 } }; // Simulate request from logged-in user

      const result = await controller.getLoggedInUserProfile(mockRequest);

      expect(result).toEqual(mockUser);
      expect(service.findOneById).toHaveBeenCalledWith(1);
    });
  });
});
