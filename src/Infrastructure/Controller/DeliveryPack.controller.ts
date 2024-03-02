import { Controller, Get } from '@nestjs/common';
import * as moment from "moment";
import { AddressServiceContract } from 'src/Application/Contract/Service/AddressServiceContract';
import { BoxServiceContract } from 'src/Application/Contract/Service/BoxServiceContract';
import { CarrierServiceContract } from 'src/Application/Contract/Service/CarrierServiceContract';
import { OrderServiceContract } from 'src/Application/Contract/Service/OrderServiceContract';
import { GroupByDelivery } from 'src/Application/Usecase/GroupByDelivery';


class DeliveryPackControllerResponseRowCarrier {
  id: string;
  name: string;
}

class DeliveryPackControllerResponseRowAddress {
  street: string;
  complement: string;
  neighborhood: string;
  zipCode: string;
  city: string;
  state: string;
}

class DeliveryPackControllerResponseRowBoxOrder {
  id: string;
}

class DeliveryPackControllerResponseRowBox {
  boxType: string;
  itemsQuantity: number;
  orders: DeliveryPackControllerResponseRowBoxOrder[];
}

class DeliveryPackControllerResponseRow {
  deliveryDate: string;
  carrier: DeliveryPackControllerResponseRowCarrier;
  address: DeliveryPackControllerResponseRowAddress;
  boxes: DeliveryPackControllerResponseRowBox[];
}

@Controller("v1/delivery-pack")
export class DeliveryPackController {
  constructor(
    private AddressService: AddressServiceContract,
    private BoxService: BoxServiceContract,
    private CarrierService: CarrierServiceContract,
    private OrderService: OrderServiceContract,
  ) { }

  @Get("")
  async get(): Promise<DeliveryPackControllerResponseRow[]> {

    const usecase = new GroupByDelivery(
      this.AddressService,
      this.BoxService,
      this.CarrierService,
      this.OrderService,
    );

    let response: DeliveryPackControllerResponseRow[];

    const deliveryPackages = await usecase.run();

    response = deliveryPackages.map((deliveryPackage) => {

      return {
        deliveryDate: moment(deliveryPackage.DeliveryDate).format('YYYY-MM-DD HH:mm:ss'),
        carrier: {
          id: deliveryPackage.Carrier.id,
          name: deliveryPackage.Carrier.name,
        },
        address: {
          street: deliveryPackage.Address.street,
          complement: deliveryPackage.Address.complement,
          neighborhood: deliveryPackage.Address.neighborhood,
          zipCode: deliveryPackage.Address.zipcode,
          city: deliveryPackage.Address.city,
          state: deliveryPackage.Address.state,
        },
        boxes: deliveryPackage.BoxPackages.map((boxPackage) => {
          return {
            boxType: boxPackage.Box.boxType,
            itemsQuantity: boxPackage.QuantityInBox,
            orders: boxPackage.Orders.map((order) => {
              return {
                id: order.Order.id,
              };
            }),
          };
        }),
      };
    });

    return response;
  }
}
