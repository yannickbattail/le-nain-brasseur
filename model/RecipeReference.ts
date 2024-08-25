/// <reference path="ICookingStep.ts" />
/// <reference path="Recipe.ts" />

class RecipeReference {
    $type : string = 'RecipeReference';
    constructor(public name: string = "",
                public steps: Array<ICookingStep> = [],
                protected level : number = 0) {
        
    }
    
    public static load(data : any) : RecipeReference {
        const curContext : any = window;
        const newObj : RecipeReference = new RecipeReference();
        newObj.name = data.name;
        newObj.level = data.level;
        newObj.steps = (data.steps as Array<any>).map(p => curContext[p.$type].load(p));
        return newObj;
    }
    
    getCookingSteps() : Array<ICookingStep> {
        return this.steps;
    }
    getName() : string {
        return this.name;
    }
    getLevel() : number {
        return this.level;
    }

    public createRecipe() : Recipe {
        const recipe = Recipe.load(JSON.parse(JSON.stringify(this)));
        recipe.name = "ma "+this.name;
        recipe.recipeRef = this;
        recipe.steps.forEach(
            s => s.getStepParameters().forEach(
                p => {
                    if (p.resource?.getName() != WATER.getName())
                        p.value = 0;
                }
            )
        );
        return recipe;
    }
    
    public duplicate() : Recipe {
        const recipe = Recipe.load(JSON.parse(JSON.stringify(this)));
        recipe.name = this.name+"#";
        return recipe;
    }
}