
import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { AddressEntity } from "src/Domain/Entity/Address";
import { CarrierServiceContract } from "src/Application/Contract/Service/CarrierServiceContract";
import { CarrierEntity } from "src/Domain/Entity/Carrier";

abstract class HaytekCarrierServiceDaoRow {
    Id: string;
    name: string;
    cutOffTime: string;
}

@Injectable()
export class HaytekCarrierService implements CarrierServiceContract {
    constructor(private readonly httpService: HttpService) { }

    async listAllCarriers(): Promise<CarrierEntity[]> {
        const url = 'https://stg-api.haytek.com.br/api/v1/test-haytek-api/carriers';

        try {
            const response = await this.httpService.get<HaytekCarrierServiceDaoRow[]>(url, {
                headers: {
                    'accept': 'application/json'
                },
            }).toPromise();

            return response.data.map((dao: HaytekCarrierServiceDaoRow): CarrierEntity => {
                const cutOffTime = dao.cutOffTime.split(":");
                return {
                    id: dao.Id,
                    name: dao.name,
                    cutOffTimeHour: parseInt(cutOffTime[0]),
                    cutOffTimeMinute: parseInt(cutOffTime[1]),
                };
            });
        } catch (error) {
            console.error('Error fetching addresses:', error.message);
            throw error;
        }
    }
}