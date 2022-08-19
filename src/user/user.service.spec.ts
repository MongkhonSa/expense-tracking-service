import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { SALT_ROUND } from '../const';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;
  const USER_REPOSITORY_TOKEN = getRepositoryToken(User);
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            save: jest.fn(),
            findOneBy: jest.fn().mockResolvedValue({
              id: 'mock-id',
              username: 'test',
              password: 'password',
              isValidated: false,
            }),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(USER_REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('userRepository should be defined', () => {
    expect(userRepository).toBeDefined();
  });
  describe('Create', () => {
    const mockCreateUserDTO = { username: 'test', password: 'password' };
    const mockHashedPassword = 'mockHashedPassword';
    beforeEach(() => {
      jest.spyOn(bcrypt, 'hashSync').mockReturnValueOnce(mockHashedPassword);
    });
    it('should hash password correctly', async () => {
      await service.create(mockCreateUserDTO);
      expect(bcrypt.hashSync).toHaveBeenCalledWith('password', SALT_ROUND);
    });
    it('should call userRepository.save correctly', async () => {
      await service.create(mockCreateUserDTO);
      expect(userRepository.save).toHaveBeenCalledWith({
        ...mockCreateUserDTO,
        password: mockHashedPassword,
      });
    });
  });
  describe('findOneBy', () => {
    const mockFindOne: User = {
      id: 'mock-id',
      username: 'test',
      password: 'password',
      isValidated: false,
    };
    const mockId = 'mockId';

    it('should return value correctly', async () => {
      const user = await service.findOne(mockId);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: mockId });
      expect(user).toEqual(mockFindOne);
    });
  });
});
