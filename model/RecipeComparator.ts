/// <reference path="ICookingStep.ts" />
/// <reference path="Recipe.ts" />

class RecipeComparator {
    
    constructor(protected recipe1: Recipe,
                protected recipe2: Recipe) {
        
    }
    
    public compare() : string {
        let actions1 = this.recipe1.getActions();
        let actions2 = this.recipe2.getActions();
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
        let actions1 = this.recipe1.getActions();
        let actions2 = this.recipe2.getActions();
        let index : number = 0;
        let notes : Array<number> = [];
        while (index < actions1.length && index < actions2.length) {
            if (actions1[index].$type != actions2[index].$type) {
                return null;
            }
            let note = actions1[index].analyse(actions2[index]);
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
}
