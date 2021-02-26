/// <reference path="./IResource.ts" />
/// <reference path="./IQuantity.ts" />
/// <reference path="./IPlayer.ts" />

class Player implements IPlayer {
    $type : string = 'Player';
    protected preventNegativeStorage : boolean = false;
    protected storage: Array<Quantity> = new Array<Quantity>();
    protected recipes: Array<Recipe> = new Array<Recipe>();
    constructor(protected name: string) {
    }
    public static load(data : any) : Player {
        let curContext : any = window;
        let player : Player = new Player(data.name);
        player.preventNegativeStorage = data.preventNegativeStorage;
        player.storage = (data.storage as Array<any>).map(p => curContext[p.$type].load(p));
        player.recipes = (data.recipes as Array<any>).map(p => curContext[p.$type].load(p));
        return player;
    }
    public getName() : string {
        return this.name;
    }
    public getStorage() : Array<IQuantity>{
        return this.storage;
    }
    public getRecipes() : Array<Recipe>{
        return this.recipes;
    }
    public setRecipes(recipes : Array<Recipe>) : IPlayer {
        this.recipes = recipes;
        return this;
    }
    
    public getPreventNegativeStorage() : boolean {
        return this.preventNegativeStorage;
    }

    public setPreventNegativeStorage(preventNegativeStorage : boolean) : Player {
        this.preventNegativeStorage = preventNegativeStorage;
        return this;
    }

    public increaseStorage(quantity: IQuantity) {
        let resQ = this.getResourceInStorage(quantity.getResource().getName());
        if (resQ == null) {
            resQ = new Quantity(0, quantity.getResource());
            this.storage.push(resQ);
        }
        if ((resQ.getQuantity() + quantity.getQuantity()) < 0 && this.preventNegativeStorage) {
            resQ.setQuantity(0);
        } else {
            resQ.setQuantity(resQ.getQuantity() + quantity.getQuantity());
        }
    }
    
    public decreaseStorage(quantity: IQuantity) {
        let resQ = this.getResourceInStorage(quantity.getResource().getName());
        if (resQ == null) {
            resQ = new Quantity(0, quantity.getResource());
            this.storage.push(resQ);
        }
        if ((resQ.getQuantity() + -1*quantity.getQuantity()) < 0 && this.preventNegativeStorage) {
            resQ.setQuantity(0);
        } else {
            resQ.setQuantity(resQ.getQuantity() + -1*quantity.getQuantity());
        }
    }

    public getResourceInStorage(resourceName: string): Quantity | null {
        let res = this.storage.filter((res: Quantity) => res.getResource().getName() == resourceName);
        if (res.length) {
            return res[0];
        }
        return null;
    }
    public hasResources(resourcesQuantity: Quantity[]): boolean {
        let hasRes = true;
        resourcesQuantity.forEach(
            resQ => {
                let playerRes = this.getResourceInStorage(resQ.getResource().getName());
                if (playerRes == null || playerRes.getQuantity() < resQ.getQuantity()) {
                    hasRes = false;
                }
            }
        );
        return hasRes;
    }
}