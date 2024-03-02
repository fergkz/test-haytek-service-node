
import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { BoxEntity } from "src/Domain/Entity/Box";
import { BoxServiceContract } from "src/Application/Contract/Service/BoxServiceContract";

abstract class HaytekBoxServiceDaoRow {
    type: string;
    maxQuantity: string;
}

@Injectable()
export class HaytekBoxService implements BoxServiceContract {
    constructor(private readonly httpService: HttpService) { }

    async listAllBoxes(): Promise<BoxEntity[]> {
        const url = 'https://stg-api.haytek.com.br/api/v1/test-haytek-api/boxes';

        try {
            const response = await this.httpService.get<HaytekBoxServiceDaoRow[]>(url, {
                headers: {
                    'accept': 'application/json'
                },
            }).toPromise();

            return response.data.map((dao: HaytekBoxServiceDaoRow): BoxEntity => {
                return {
                    boxType: dao.type,
                    maxQuantity: parseInt(dao.maxQuantity)
                };
            });
        } catch (error) {
            console.error('Error fetching addresses:', error.message);
            throw error;
        }
    }
}