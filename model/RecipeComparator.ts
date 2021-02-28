/// <reference path="ICookingStep.ts" />
/// <reference path="Recipe.ts" />

class RecipeComparator {
    
    constructor(protected recipeReference: RecipeReference,
                protected recipe: Recipe) {
        
    }
    
    public compare() : string {
        let actions1 = this.recipeReference.getActions();
        let actions2 = this.recipe.getActions();
        let index : number = 0;
        while (index < actions1.length && index < actions2.length) {
            if (actions1[index].$type != actions2[index].$type) {
                return "L'étape #"+index+" devrait être "+actions2[index].$type;
            }
            let comp = actions1[index].compare(actions2[index]);
            if (comp !== null && comp !== "") {
                return "Problème avec l'étape #"+index+" "+comp;
            }
            index++;
        }
        if (actions1.length > actions2.length) {
            return "Il manque "+(actions1.length - actions2.length)+" étape(s).";
        }
        else if (actions1.length < actions2.length) {
            return "Il y a "+(actions1.length - actions2.length)+" étape(s) en trop.";
        } else {
            return "";
        }
    }

    public analyse() : number|null {
        let actionsRef = this.recipeReference.getActions();
        let actions = this.recipe.getActions();
        let index : number = 0;
        let notes : Array<number> = [];
        while (index < actionsRef.length && index < actions.length) {
            if (actionsRef[index].$type != actions[index].$type) {
                return null;
            }
            let note = actionsRef[index].analyse(actions[index]);
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
