import { IQuantity } from './IQuantity.js';
import { Resource } from './Resource.js';
import { IResource } from './IResource.js';
import { ClassLoader } from '../../Services/ClassLoader.js';

export class Quantity implements IQuantity {
    $type: string = 'Quantity';

    constructor(
        protected quantity: number,
        protected resource: IResource,
    ) {}

    public static load(obj: unknown): Quantity {
        const data: Quantity = obj as Quantity;
        const res: IResource = ClassLoader.load(data.resource) as IResource;
        return new Quantity(data.quantity, res);
    }

    getQuantity(): number {
        return this.quantity;
    }

    setQuantity(quantity: number): void {
        this.quantity = quantity;
    }

    getResource(): IResource {
        return this.resource;
    }

    show(): string {
        return this.resource.show(this.quantity);
    }

    opposite(): Quantity {
        return new Quantity(this.quantity * -1, this.resource);
    }
}

export const EMPTY_QUANTITY = new Quantity(0, new Resource('nothing'));
