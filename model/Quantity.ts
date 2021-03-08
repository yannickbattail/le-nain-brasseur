/// <reference path="./IResource.ts" />
/// <reference path="./IQuantity.ts" />

class Quantity implements IQuantity{
    $type : string = 'Quantity';
    constructor(protected quantity: number, protected resource: IResource) {
    }
    public static load(data : any) : Quantity {
        let curContext : any = window;
        let res = curContext[data.resource.$type].load(data.resource);
        let rq : Quantity = new Quantity(data.quantity, res);
        return rq;
    }
    getQuantity() : number {
        return this.quantity;
    }
    setQuantity(quantity : number) : void {
        this.quantity = quantity;
    }
    getResource() : IResource{
        return this.resource;
    }
    show() : string{
        return this.resource.show(this.quantity);
    }
    opposite() : Quantity {
        return new Quantity(this.quantity * -1 , this.resource);
    }
}
const EMPTY_QUANTITY = new Quantity(0, new Resource("nothing"));
