/// <reference path="RecipeReference.ts" />

class Recipe extends RecipeReference {
    $type : string = 'Recipe';
    constructor(public name: string = "",
                public actions: Array<ICookingStep> = [],
                public recipeRef : RecipeReference) {
        super(name, actions);
    }
    
    public static load(data : any) : Recipe {
        let curContext : any = window;
        let name = data.name;
        let actions = (data.actions as Array<any>).map(p => curContext[p.$type].load(p));
        let recipeRef = curContext[data.recipeRef.$type].load(data.recipeRef);
        let newObj : Recipe = new Recipe(name, actions, recipeRef);
        return newObj;
    }
    
    getCookingSteps() : Array<ICookingStep> {
        return this.actions;
    }
    getName() : string {
        return this.name;
    }
}