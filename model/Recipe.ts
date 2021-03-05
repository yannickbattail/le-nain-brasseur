/// <reference path="RecipeReference.ts" />
/// <reference path="AnalysisLevel.ts" />

class Recipe extends RecipeReference {
    $type : string = 'Recipe';
    public score : number | null = null;
    public problem: string | null = null;
    public analysisLevel: AnalysisLevel = AnalysisLevel.NONE;
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
        newObj.score = data.score;
        newObj.problem = data.problem;
        newObj.analysisLevel = data.analysisLevel;
        return newObj;
    }
    
    getCookingSteps() : Array<ICookingStep> {
        return this.steps;
    }
    getName() : string {
        return this.name;
    }
    
    public hasProblem() : boolean {
        let prob = this.getCookingSteps().map(
            s => s.getStepParameters()
                .map(s => (s.problem!=null && s.problem!=""))
                .reduce((a, b) => (a || b), false)
        ).reduce((a, b) => (a || b), false);
        return prob;
    }
}
