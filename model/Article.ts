/// <reference path="./IResource.ts" />
/// <reference path="./IQuantity.ts" />

class Article {
    $type : string = 'Article';
    constructor(public resource: IQuantity, public cost: IQuantity) {
    }
    public static load(data : any) : Article {
        let curContext : any = window;
        const res = curContext[data.resource.$type].load(data.resource);
        const cost = curContext[data.cost.$type].load(data.cost);
        let rq : Article = new Article(res, cost);
        return rq;
    }

}
