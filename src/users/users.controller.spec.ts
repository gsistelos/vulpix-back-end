import { Test, TestingModule } from '@nestjs/testing';
import { hashPassword } from 'src/lib/hash';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  const mockService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  describe('create', () => {
    it('should call service.create with hashed password', async () => {
      const createUserDto: CreateUserDto = {
        username: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      await controller.create({ ...createUserDto });

      expect(mockService.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: hashPassword(createUserDto.password),
      });
    });
  });
});
