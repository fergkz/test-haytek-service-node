import { Module } from '@nestjs/common';
import { DeliveryPackController } from './Infrastructure/Controller/DeliveryPack.controller';
import { HaytekAddressService } from './Infrastructure/Service/Haytek/AddressService';
import { AddressServiceContract } from './Application/Contract/Service/AddressServiceContract';
import { HttpModule } from '@nestjs/axios';
import { BoxServiceContract } from './Application/Contract/Service/BoxServiceContract';
import { CarrierServiceContract } from './Application/Contract/Service/CarrierServiceContract';
import { OrderServiceContract } from './Application/Contract/Service/OrderServiceContract';
import { HaytekBoxService } from './Infrastructure/Service/Haytek/BoxService';
import { HaytekCarrierService } from './Infrastructure/Service/Haytek/CarrierService';
import { HaytekOrderService } from './Infrastructure/Service/Haytek/OrderService';

@Module({
  imports: [HttpModule],
  controllers: [DeliveryPackController],
  providers: [
    {
      provide: AddressServiceContract,
      useClass: HaytekAddressService
    },
    {
      provide: BoxServiceContract,
      useClass: HaytekBoxService,
    },
    {
      provide: CarrierServiceContract,
      useClass: HaytekCarrierService,
    },
    {
      provide: OrderServiceContract,
      useClass: HaytekOrderService,
    },
  ],
})
export class AppModule { }
