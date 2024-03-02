import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryPackController } from './DeliveryPack.controller';

describe('AppController', () => {
  let deliveryPackController: DeliveryPackController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryPackController],
      providers: [],
    }).compile();

    deliveryPackController = app.get<DeliveryPackController>(DeliveryPackController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(deliveryPackController.getHello()).toBe('Hello World!');
    });
  });
});
