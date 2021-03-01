/// <reference path="RecipeReference.ts" />

class Recipe extends RecipeReference {
    $type : string = 'Recipe';
    constructor(public name: string = "",
                public steps: Array<ICookingStep> = [],
                public recipeRef : RecipeReference | null = null) {
        super(name, steps);
    }
    
    public static load(data : any) : Recipe {
        let curContext : any = window;
        let name = data.name;
        let steps = (data.steps as Array<any>).map(p => curContext[p.$type].load(p));
        let recipeRef = data.recipeRef!=null?curContext[data.recipeRef.$type].load(data.recipeRef):null;
        let newObj : Recipe = new Recipe(name, steps, recipeRef);
        return newObj;
    }
    
    getCookingSteps() : Array<ICookingStep> {
        return this.steps;
    }
    getName() : string {
        return this.name;
    }
}