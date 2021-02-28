/// <reference path="CookingStep.ts" />

class Brewing extends CookingStep {
    $type : string = 'Brewing';
    constructor(public duration: number = 0) {
        super();
    }
    
    public static load(data : any) : Brewing {
        let newObj : Brewing = new Brewing();
        newObj.duration = data.duration;
        return newObj;
    }
    
    getName() : string {
        return "Fermenter";
    }
    getImage() : string {
        return "boiling-bubbles.svg";
    }
    public compare(action : ICookingStep) : string {
        if (this.$type != action.$type) {
            return "L'étape devrait être "+this.$type;
        }
        let addIngredient = action as Brewing;
        return this.compareHeat(addIngredient);
    }
    public compareHeat(action : Brewing) : string {
        if (this.duration > action.duration) {
            return "La fermentation est trop courte";
        }
        if (this.duration < action.duration) {
            return "La fermentation est trop longue";
        }
        return "";
    }

    analyse(action: ICookingStep): number | null {
        if (action instanceof Brewing) {
            this.analyseBrewing(action);
        }
        return null;

    }

    analyseBrewing(action: Brewing): number | null {
        return RecipeAnalysis.scoring(this.duration, action.duration);
    }
}