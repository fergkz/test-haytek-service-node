
import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { AddressEntity } from "src/Domain/Entity/Address";
import { OrderServiceContract } from "src/Application/Contract/Service/OrderServiceContract";
import { OrderEntity } from "src/Domain/Entity/Order";

abstract class HaytekOrderServiceDaoRow {
    Id: string;
    addressId: string;
    carrierId: string;
    quantity: number;
    createdAt: string;
}

@Injectable()
export class HaytekOrderService implements OrderServiceContract {
    constructor(private readonly httpService: HttpService) { }

    async listAllOrders(): Promise<OrderEntity[]> {
        const url = 'https://stg-api.haytek.com.br/api/v1/test-haytek-api/orders';

        try {
            const response = await this.httpService.get<HaytekOrderServiceDaoRow[]>(url, {
                headers: {
                    'accept': 'application/json'
                },
            }).toPromise();

            return response.data.map((dao: HaytekOrderServiceDaoRow): OrderEntity => {
                return {
                    id: dao.Id,
                    addressId: dao.addressId,
                    carrierId: dao.carrierId,
                    quantity: dao.quantity,
                    createdAt: new Date(dao.createdAt),
                };
            });
        } catch (error) {
            console.error('Error fetching addresses:', error.message);
            throw error;
        }
    }
}