/// <reference path="./IResource.ts" />
/// <reference path="./Resource.ts" />
/// <reference path="./ICategorized.ts" />
/// <reference path="./CategorizedMaterial.ts" />
/// <reference path="./Recipe.ts" />

class Beer extends CategorizedMaterial implements ICategorized {
    public $type : string = 'Beer';
    
    constructor(public name : string,
                public unit : string,
                public image : string,
                public category : string,
                public description : string,
                public recipe : Recipe){
        super(name, unit, image, category, description);
    }
    public static load(data : any) : Beer {
        let curContext : any = window;
        let recipe = curContext[data.recipe.$type].load(data.recipe);
        let r : Beer = new Beer(data.name, data.unit, data.image, data.category, data.description, recipe);
        return r;
    }
    public show(quantity : number) : string {
        let u = this.unit;
        let q = quantity;
        if (u == 'g') {
            if (quantity >= 1000000) {
                u = 'T';
                q = Math.round(q / 10000) / 100;
            }
            else if (quantity >= 1000) {
                u = 'kg';
                q = Math.round(q / 100) / 10;
            }
        }
        if (u == 'cl') {
            if (quantity >= 100) {
                u = 'l';
                q = Math.round(q / 10) / 10;
            }
        }
        return q + u;
    }
}
