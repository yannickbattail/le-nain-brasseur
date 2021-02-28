/// <reference path="RecipeReference.ts" />

class Recipe extends RecipeReference {
    $type : string = 'Recipe';
    constructor(public name: string = "",
                public actions: Array<ICookingStep> = [],
                public recipeRef : RecipeReference | null = null) {
        super(name, actions);
    }
    
    public static load(data : any) : Recipe {
        let curContext : any = window;
        let newObj : Recipe = new Recipe();
        newObj.name = data.name;
        newObj.recipeRef = curContext[data.recipeRef.$type].load(data.recipeRef);
        newObj.actions = (data.actions as Array<any>).map(p => curContext[p.$type].load(p));
        return newObj;
    }
    
    getActions() : Array<ICookingStep> {
        return this.actions;
    }
    getName() : string {
        return this.name;
    }
}