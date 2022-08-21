import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { User } from '../user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { SALT_ROUND } from '../const';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LoginDto } from './dto/login.dto';
describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let userService: UserService;
  const USER_REPOSITORY_TOKEN = getRepositoryToken(User);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findOneByUsername: jest.fn().mockResolvedValue({
              username: 'mockUserName',
              password: bcrypt.hashSync('mockPassword', SALT_ROUND),
            }),
          },
        },
        JwtService,
        { provide: DataSource, useValue: {} },
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
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });
  describe('validateUser', () => {
    const mockLogin: LoginDto = {
      username: 'mockUserName',
      password: 'mockPassword',
    };
    it('should login succesfully', async () => {
      jest.spyOn(jwtService, 'sign').mockReturnValue('mock-token');
      await authService.validateUser(mockLogin.username, mockLogin.password);
      expect(userService.findOneByUsername).toHaveBeenCalledWith(
        mockLogin.username,
      );
    });
  });
});
