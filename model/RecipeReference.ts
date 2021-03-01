/// <reference path="ICookingStep.ts" />
/// <reference path="Recipe.ts" />

class RecipeReference {
    $type : string = 'RecipeReference';
    constructor(public name: string = "",
                public steps: Array<ICookingStep> = []) {
        
    }
    
    public static load(data : any) : RecipeReference {
        let curContext : any = window;
        let newObj : RecipeReference = new RecipeReference();
        newObj.name = data.name;
        newObj.steps = (data.steps as Array<any>).map(p => curContext[p.$type].load(p));
        return newObj;
    }
    
    getCookingSteps() : Array<ICookingStep> {
        return this.steps;
    }
    getName() : string {
        return this.name;
    }

    public createRecipe() : Recipe {
        let recipe = Recipe.load(JSON.parse(JSON.stringify(this)));
        recipe.name = "ma "+this.name;
        recipe.recipeRef = this;
        recipe.steps.forEach(
            s => s.getStepParameters().forEach(
                p => p.value = 0
            )
        );
        return recipe;
    }
}