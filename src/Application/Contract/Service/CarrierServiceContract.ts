import { CarrierEntity } from "src/Domain/Entity/Carrier";

export abstract class CarrierServiceContract {
    abstract listAllCarriers(): Promise<CarrierEntity[]>;
}