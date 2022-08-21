import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource } from 'typeorm';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  const USER_REPOSITORY_TOKEN = getRepositoryToken(User);
  const mockDataSource = () => ({
    transaction: jest.fn(),
  });
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: DataSource,
          useFactory: mockDataSource,
        },
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });
  describe('create', () => {
    it('should return an create user', async () => {
      const mockCreateUserDTO = {
        username: 'test',
        password: 'password',
      };
      const mockResult = {
        id: 'mock-id',
        username: 'test',
        password: 'password',
        isValidated: false,
      };
      jest.spyOn(userService, 'create').mockResolvedValue(mockResult);
      expect(await userController.create(mockCreateUserDTO)).toBe(mockResult);
      expect(await userService.create).toHaveBeenCalledWith(mockCreateUserDTO);
    });
  });
});
