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
    it('should call service.healthCheck', () => {
      controller.healthCheck();

      expect(mockService.healthCheck).toHaveBeenCalled();
    });
  });
});
