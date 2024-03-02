
import { Injectable } from "@nestjs/common";
import { AddressServiceContract } from "src/Application/Contract/Service/AddressServiceContract";
import { HttpService } from "@nestjs/axios";
import { AddressEntity } from "src/Domain/Entity/Address";

abstract class HaytekAddressServiceDaoRow {
    Id: string;
    state: string;
    zipcode: string;
    street: string;
    complement: string;
    neighborhood: string;
    city: string;
}

@Injectable()
export class HaytekAddressService implements AddressServiceContract {
    constructor(private readonly httpService: HttpService) { }

    async listAllAddresses(): Promise<AddressEntity[]> {
        const url = 'https://stg-api.haytek.com.br/api/v1/test-haytek-api/adresses';

        try {
            const response = await this.httpService.get<HaytekAddressServiceDaoRow[]>(url, {
                headers: {
                    'accept': 'application/json'
                },
            }).toPromise();

            return response.data.map((dao: HaytekAddressServiceDaoRow): AddressEntity => {
                return {
                    id: dao.Id,
                    state: dao.state,
                    zipcode: dao.zipcode,
                    street: dao.street,
                    complement: dao.complement,
                    neighborhood: dao.neighborhood,
                    city: dao.city
                };
            });
        } catch (error) {
            console.error('Error fetching addresses:', error.message);
            throw error;
        }
    }
}