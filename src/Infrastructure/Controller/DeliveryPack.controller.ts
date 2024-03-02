import { Controller, Get } from '@nestjs/common';
import { AddressServiceContract } from 'src/Application/Contract/Service/AddressServiceContract';
import { BoxServiceContract } from 'src/Application/Contract/Service/BoxServiceContract';
import { CarrierServiceContract } from 'src/Application/Contract/Service/CarrierServiceContract';
import { OrderServiceContract } from 'src/Application/Contract/Service/OrderServiceContract';
import { GroupByDelivery } from 'src/Application/Usecase/GroupByDelivery';

@Controller("v1/delivery-pack")
export class DeliveryPackController {
  constructor(
    private AddressService: AddressServiceContract,
    private BoxService: BoxServiceContract,
    private CarrierService: CarrierServiceContract,
    private OrderService: OrderServiceContract,
  ) { }

  @Get("")
  async get(): Promise<any> {

    const usecase = new GroupByDelivery(
      this.AddressService,
      this.BoxService,
      this.CarrierService,
      this.OrderService,
    );

    const addresses = await usecase.run();

    return addresses;
  }
}
