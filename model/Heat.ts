/// <reference path="CookingAction.ts" />

class Heat extends CookingAction {
    $type : string = 'Heat';
    constructor(protected duration: number = 0,
                protected degrees: number = 0) {
        super();
    }
    
    public compare(action : ICookingAction) : string {
        if (action !instanceof Heat) {
            return "L'étape devrait être "+this.$type;
        }
        if (this.$type != action.$type) {
            return "L'étape devrait être "+this.$type;
        }
        let addIngredient = action as Heat;
        return this.compareHeat(addIngredient);
    }
    public compareHeat(action : Heat) : string {
        if (this.degrees > action.degrees) {
            return "La cuisson n'est pas assez chaude";
        }
        if (this.degrees < action.degrees) {
            return "La cuisson est trop chaude";
        }
    
        if (this.duration > action.duration) {
            return "La cuisson est trop courte";
        }
        if (this.duration < action.duration) {
            return "La cuisson est trop longue";
        }
        return "";
    }

    analyse(action: ICookingAction): number | null {
        if (action instanceof Heat) {
            this.analyseHeat(action);
        }
        return null;

    }

    analyseHeat(action: Heat): number | null {
        const degreeNote = this.notation(this.degrees, action.degrees);
        const durationNote = this.notation(this.duration, action.duration);
        return Math.min(degreeNote, durationNote) ;
    }
}
