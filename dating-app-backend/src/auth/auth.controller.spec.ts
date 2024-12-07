import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signup: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should return the created user from the service', async () => {
      const mockUser = { id: 1, username: 'testuser' };
      jest.spyOn(service, 'signup').mockResolvedValue(mockUser);

      const result = await controller.signup({ username: 'testuser', password: 'securepassword' });

      expect(result).toEqual(mockUser);
      expect(service.signup).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'securepassword',
      });
    });
  });

  describe('login', () => {
    it('should return a JWT token from the service', async () => {
      const mockToken = { accessToken: 'mock.jwt.token' };
      jest.spyOn(service, 'login').mockResolvedValue(mockToken);

      const result = await controller.login({ username: 'testuser', password: 'securepassword' });

      expect(result).toEqual(mockToken);
      expect(service.login).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'securepassword',
      });
    });
  });
});
