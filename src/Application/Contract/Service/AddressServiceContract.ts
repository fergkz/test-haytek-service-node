import { AddressEntity } from "src/Domain/Entity/Address";

export abstract class AddressServiceContract {
    abstract listAllAddresses(): Promise<AddressEntity[]>;
}