/// <reference path="ICookingStep.ts" />
/// <reference path="Recipe.ts" />

class Brew {
    $type : string = 'Recipe';
    constructor(public name: string = "",
                public recipe: Recipe) {

    }

    public static load(data : any) : Brew {
        let curContext : any = window;
        let recipe : Recipe = curContext[data.recipe.$type].load(data.recipe);
        let newObj : Brew = new Brew(data.name, recipe);
        return newObj;
    }
    
    getName() : string {
        return this.name;
    }
}