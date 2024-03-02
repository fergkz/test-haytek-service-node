import { AddressEntity } from "src/Domain/Entity/Address";
import { AddressServiceContract } from "../Contract/Service/AddressServiceContract";
import { BoxServiceContract } from "../Contract/Service/BoxServiceContract";
import { CarrierServiceContract } from "../Contract/Service/CarrierServiceContract";
import { OrderServiceContract } from "../Contract/Service/OrderServiceContract";
import { OrderEntity } from "src/Domain/Entity/Order";
import { BoxEntity } from "src/Domain/Entity/Box";
import { CarrierEntity } from "src/Domain/Entity/Carrier";

class DeliveryPackageBoxOrderRow {
    Order: OrderEntity;
    Quantity: number;
}

class DeliveryPackageBox {
    Box: BoxEntity;
    QuantityInBox: number;
    Orders: DeliveryPackageBoxOrderRow[];
}

class DeliveryPackage {
    DeliveryDate: Date;
    Carrier: CarrierEntity;
    Address: AddressEntity;
    BoxPackages: DeliveryPackageBox[];
    AllOrders: OrderEntity[];
}

export class GroupByDelivery {
    constructor(
        private AddressService: AddressServiceContract,
        private BoxService: BoxServiceContract,
        private CarrierService: CarrierServiceContract,
        private OrderService: OrderServiceContract,
    ) { }

    async run(): Promise<DeliveryPackage[]> {

        return new Promise<DeliveryPackage[]>((resolve, reject) => {
            resolve([]);
        });
    }
}