import { OrderEntity } from "src/Domain/Entity/Order";

export abstract class OrderServiceContract {
    abstract listAllOrders(): Promise<OrderEntity[]>;
}