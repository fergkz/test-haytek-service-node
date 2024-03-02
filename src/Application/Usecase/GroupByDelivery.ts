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

        const addresses: AddressEntity[] = await this.AddressService.listAllAddresses();
        const boxes: BoxEntity[] = await this.BoxService.listAllBoxes();
        const carriers: CarrierEntity[] = await this.CarrierService.listAllCarriers();
        const orders: OrderEntity[] = await this.OrderService.listAllOrders();

        const exampleOfDeliveryPackage: DeliveryPackage = {
            DeliveryDate: new Date(),
            Carrier: {
                id: "1",
                name: "Carrier 1",
                cutOffTimeHour: 12,
                cutOffTimeMinute: 30,
            },
            Address: {
                id: "1",
                street: "Rua dos Bobos",
                complement: "Apto 123",
                neighborhood: "Centro",
                zipcode: "12345-678",
                city: "São Paulo",
                state: "SP",
            },
            BoxPackages: [
                {
                    Box: {
                        boxType: "Small",
                        maxQuantity: 10,
                    },
                    QuantityInBox: 5,
                    Orders: [
                        {
                            Order: {
                                id: "1",
                                addressId: "1",
                                carrierId: "1",
                                quantity: 5,
                                createdAt: new Date(),
                            },
                            Quantity: 5,
                        }
                    ]
                }
            ],
            AllOrders: [
                {
                    id: "1",
                    addressId: "1",
                    carrierId: "1",
                    quantity: 5,
                    createdAt: new Date(),
                }
            ],
        };

        return new Promise<DeliveryPackage[]>((resolve, reject) => {
            resolve([exampleOfDeliveryPackage]);
        });
    }
}