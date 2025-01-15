import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let controller: AppController;

  const mockService = {
    healthCheck: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = app.get<AppController>(AppController);
  });

  describe('healthCheck', () => {
    it('should return { status: "OK" }', () => {
      mockService.healthCheck.mockImplementation(() => ({ status: 'OK' }));

      const result = controller.healthCheck();

      expect(result).toEqual({ status: 'OK' });
    });
  });
});
