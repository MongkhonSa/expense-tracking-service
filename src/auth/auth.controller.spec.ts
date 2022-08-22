import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { DataSource } from 'typeorm';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { SALT_ROUND } from '../const';

describe('AuthController', () => {
  let authController: AuthController;
  let jwtService: JwtService;
  const USER_REPOSITORY_TOKEN = getRepositoryToken(User);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        JwtService,
        {
          provide: DataSource,
          useValue: {},
        },
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            findOneBy: jest.fn().mockResolvedValue({
              username: 'mockUserName',
              password: bcrypt.hashSync('mockPassword', SALT_ROUND),
            }),
          },
        },
      ],
      controllers: [AuthController],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });
  describe('login', () => {
    const mockLogin: LoginDto = {
      username: 'mockUserName',
      password: 'mockPassword',
    };
    it('should login succesfully', async () => {
      jest.spyOn(jwtService, 'sign').mockReturnValue('mock-token');
      expect(await authController.login(mockLogin)).toEqual({
        accessToken: 'mock-token',
      });
    });
    it('should not login ', async () => {
      expect(
        await authController.login({ ...mockLogin, password: 'mock' }),
      ).toBeNull();
    });
  });
});
