import { BoxEntity } from "src/Domain/Entity/Box";

export abstract class BoxServiceContract {
    abstract listAllBoxes(): Promise<BoxEntity[]>;
}