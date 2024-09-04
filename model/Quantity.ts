import { IQuantity } from "./IQuantity.js";
import { Resource } from "./Resource.js";
import { IResource } from "./IResource.js";

export class Quantity implements IQuantity {
  $type: string = "Quantity";

  constructor(
    protected quantity: number,
    protected resource: IResource,
  ) {}

  public static load(data: any): Quantity {
    const curContext: any = window;
    const res = curContext[data.resource.$type].load(data.resource);
    const rq: Quantity = new Quantity(data.quantity, res);
    return rq;
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

export const EMPTY_QUANTITY = new Quantity(0, new Resource("nothing"));
