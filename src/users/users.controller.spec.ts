import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    createUser: jest.fn().mockResolvedValue({ id: '1', name: 'Test User' }),
    getUsers: jest.fn().mockResolvedValue([{ id: '1', name: 'Test User' }]),
    getUserById: jest.fn().mockResolvedValue({ id: '1', name: 'Test User' }),
    updateUser: jest.fn().mockResolvedValue({ id: '1', name: 'Updated User' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call UsersService.createUser', async () => {
    const mockCreateUserDto = { name: 'New User', email: 'newuser@example.com', phone: '1234567890' };
  
    const result = await controller.createUser(mockCreateUserDto);
    expect(usersService.createUser).toHaveBeenCalledWith(mockCreateUserDto);
    expect(result).toEqual({ id: '1', name: 'Test User' });
  });

  it('should return a list of users', async () => {
    const result = await controller.getUsers(10);
    expect(usersService.getUsers).toHaveBeenCalledWith(10, undefined);
    expect(result).toEqual([{ id: '1', name: 'Test User' }]);
  });

  it('should return a user by ID', async () => {
    const result = await controller.getUserById('1');
    expect(usersService.getUserById).toHaveBeenCalledWith('1');
    expect(result).toEqual({ id: '1', name: 'Test User' });
  });

  it('should update a user', async () => {
    const result = await controller.updateUser('1', { name: 'Updated User' });
    expect(usersService.updateUser).toHaveBeenCalledWith('1', { name: 'Updated User' });
    expect(result).toEqual({ id: '1', name: 'Updated User' });
  });
});
