/// <reference path="ICookingStep.ts" />
/// <reference path="Recipe.ts" />

class RecipeAnalysis {
    
    constructor(protected recipe: Recipe) {
        
    }
    
    public compare() : string {
        if (!this.recipe.recipeRef) {
            throw "no recipeRef";
        }
        let stepsRef = this.recipe.recipeRef.getCookingSteps();
        let steps = this.recipe.getCookingSteps();
        let index : number = 0;
        while (index < stepsRef.length && index < steps.length) {
            if (stepsRef[index].$type != steps[index].$type) {
                return "L'étape #"+index+" devrait être "+steps[index].$type;
            }
            let comp = stepsRef[index].compare(steps[index]);
            if (comp !== null && comp !== "") {
                return "Problème avec l'étape #"+index+" "+comp;
            }
            index++;
        }
        if (stepsRef.length > steps.length) {
            return "Il manque "+(stepsRef.length - steps.length)+" étape(s).";
        }
        else if (stepsRef.length < steps.length) {
            return "Il y a "+(stepsRef.length - steps.length)+" étape(s) en trop.";
        } else {
            return "";
        }
    }

    public analyse() : number|null {
        if (!this.recipe.recipeRef) {
            throw "no recipeRef";
        }
        let stepsRef = this.recipe.recipeRef.getCookingSteps();
        let steps = this.recipe.getCookingSteps();
        let index : number = 0;
        let notes : Array<number> = [];
        while (index < stepsRef.length && index < steps.length) {
            if (stepsRef[index].$type != steps[index].$type) {
                return null;
            }
            let note = stepsRef[index].analyse(steps[index]);
            if (note === null) {
                return null;
            }
            notes.push(note);
            index++;
        }
        const sum = notes.reduce((a, b) => a + b, 0);
        const avg = (sum / notes.length) || 0;
        return avg;
    }


    public static scoring(expected: number, actual: number): number {
        const halfExpected = expected / 2;
        const diff = Math.abs(expected - actual);
        if (diff > halfExpected) {
            return 0;
        }
        return 1 - (diff / halfExpected);
    }
}
