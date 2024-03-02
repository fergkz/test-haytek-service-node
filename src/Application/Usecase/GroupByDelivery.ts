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
        const addressesMap = {};
        addresses.forEach((address) => {
            addressesMap[address.id] = address;
        });

        const boxes: BoxEntity[] = await this.BoxService.listAllBoxes();
        boxes.sort((a, b) => b.maxQuantity - a.maxQuantity);

        const carriers: CarrierEntity[] = await this.CarrierService.listAllCarriers();
        const carriersMap = {};
        carriers.forEach((carrier) => {
            carriersMap[carrier.id] = carrier;
        });

        const orders: OrderEntity[] = await this.OrderService.listAllOrders();

        // Agrumapento por Transportadora, Endereço e Data
        const packGroud = {};
        for (const order of orders) {

            if (!packGroud[order.carrierId]) {
                packGroud[order.carrierId] = {};
            }

            if (!packGroud[order.carrierId][order.addressId]) {
                packGroud[order.carrierId][order.addressId] = {};
            }

            const deliveryDate = this.getDeliveryDate(order, carriersMap[order.carrierId]);
            const deliveryDateKey = deliveryDate.toISOString();

            if (!packGroud[order.carrierId][order.addressId][deliveryDateKey]) {
                packGroud[order.carrierId][order.addressId][deliveryDateKey] = {
                    DeliveryDate: deliveryDate,
                    Carrier: carriersMap[order.carrierId],
                    Address: addressesMap[order.addressId],
                    BoxPackages: [],
                    AllOrders: [],
                };
            }

            packGroud[order.carrierId][order.addressId][deliveryDateKey].AllOrders.push(order);
        }

        const packages: DeliveryPackage[] = [];

        // Para cada pacote (dia), faz a separação em caixas
        for (const carrierId in packGroud) {
            for (const addressId in packGroud[carrierId]) {
                for (const deliveryDateKey in packGroud[carrierId][addressId]) {
                    const deliveryDatePack = packGroud[carrierId][addressId][deliveryDateKey];
                    deliveryDatePack.BoxPackages = this.splitOrdersInBoxes(deliveryDatePack.AllOrders, boxes);
                    packages.push(deliveryDatePack as DeliveryPackage);
                }
            }
        }

        return new Promise<DeliveryPackage[]>((resolve, reject) => {
            resolve(packages);
        });
    }

    splitOrdersInBoxes(orders: OrderEntity[], boxesOptions: BoxEntity[]): DeliveryPackageBox[] {
        const packBoxes: DeliveryPackageBox[] = [];

        // Precisamos ordenar os pedidos por quantidade (descrescente) para garantir que os maiores pedidos sejam alocados primeiro
        orders.sort((a, b) => b.quantity - a.quantity);

        // Calcula o total de itens e mapeia os pedidos por quantidade
        // O total de itens será utilizado para saber quantas caixas serão necessárias no total para esse pacote
        // Utilizamos um map para facilitar a busca do pedido pelo ID e manipular a quantidade sem alterar o objeto original
        let totalItems = 0;
        const orderQuantityMap = {};
        orders.forEach((order) => {
            totalItems += order.quantity;
            orderQuantityMap[order.id] = order.quantity;
        });

        // Ordena as caixas por quantidade (crescente) para garantir que as maiores caixas sejam calculadas primeiro
        boxesOptions.sort((a, b) => a.maxQuantity - b.maxQuantity);

        // Baseado na quantidade total de itens, faz a separação de quantas e quais caixas serão necessárias
        // Faremos em duas etapas para prevenir um loop adicional e ocupar menos memória abaixo
        while (totalItems > 0) {
            for (let ibox = 0; ibox < boxesOptions.length; ibox++) {
                const box = boxesOptions[ibox];

                if (totalItems <= box.maxQuantity) {
                    packBoxes.push({
                        Box: box,
                        QuantityInBox: 0,
                        Orders: [],
                    });

                    totalItems = 0;
                    break;
                }

                // If not exists a big of that
                if (ibox === boxesOptions.length - 1) {
                    packBoxes.push({
                        Box: box,
                        QuantityInBox: 0,
                        Orders: [],
                    });

                    totalItems -= box.maxQuantity;

                    break;
                }
            }
        }

        // Varre todos os pedidos do pacote e os aloca nas caixas mais adequadas (maiores primeiro)
        // Também agrupa os pedidos por caixa, para aproveitar o espaço de cada caixa
        let currentBox = 0;
        for (let iOrder = 0; iOrder < orders.length; iOrder++) {
            const order = orders[iOrder];

            const orderId = order.id;

            for (let ibox = currentBox; ibox < packBoxes.length; ibox++) {
                currentBox = ibox;

                const orderRow = new DeliveryPackageBoxOrderRow();
                orderRow.Order = order;
                orderRow.Quantity = orderQuantityMap[orderId];
                packBoxes[ibox].Orders.push(orderRow);

                const currentSpaceInBox = packBoxes[ibox].Box.maxQuantity - packBoxes[ibox].QuantityInBox;

                // Se o espaço da caixa é maior ou igual ao total do pedido
                if (currentSpaceInBox >= orderQuantityMap[orderId]) {
                    packBoxes[ibox].QuantityInBox += orderQuantityMap[orderId]; // Aumentamos o espaço utilizado na caixa para o total do pedido
                    orderQuantityMap[orderId] = 0; // Zeramos o pedido
                    break; // Direciona para processar o próximo pedido
                }

                // Se o espaço da caixa é menor que o total do pedido
                packBoxes[ibox].QuantityInBox += currentSpaceInBox; // Aumentamos o espaço utilizado na caixa até o limite da caixa
                orderQuantityMap[orderId] -= currentSpaceInBox; // Diminuímos os itens que foram alocados na caixa do total do pedido

                // Se o pedido foi totalmente alocado na caixa
                if (orderQuantityMap[orderId] === 0) {
                    break; // Direciona para processar o próximo pedido
                }
            }
        };

        return packBoxes;

    }

    getDeliveryDate(order: OrderEntity, carrier: CarrierEntity): Date {
        const orderDate = order.createdAt;

        const cutHour = carrier.cutOffTimeHour;
        const cutMinute = carrier.cutOffTimeMinute;

        const orderHour = orderDate.getHours();
        const orderMinute = orderDate.getMinutes();

        if (orderHour > cutHour || (orderHour === cutHour && orderMinute > cutMinute)) {
            const startOfDay = new Date(
                orderDate.getFullYear(),
                orderDate.getMonth(),
                orderDate.getDate(),
                0, 0, 0, 0
            );

            orderDate.setDate(startOfDay.getDate() + 1);
            orderDate.setHours(0, 0, 0, 0);
        }

        return orderDate;
    }
}