/// <reference path="CookingStep.ts" />

class Heat extends CookingStep {
    $type : string = 'Heat';
    constructor(public duration: number = 0,
                public degrees: number = 0) {
        super();
    }

    public static load(data : any) : Heat {
        let newObj : Heat = new Heat();
        newObj.duration = data.duration;
        newObj.degrees = data.degrees;
        return newObj;
    }

    getName() : string {
        return "Chauffer";
    }
    getImage() : string {
        return "camp-cooking-pot.svg";
    }
    public compare(action : ICookingStep) : string {
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

    analyse(action: ICookingStep): number | null {
        if (action instanceof Heat) {
            this.analyseHeat(action);
        }
        return null;

    }

    analyseHeat(action: Heat): number | null {
        const degreeNote = this.scoring(this.degrees, action.degrees);
        const durationNote = this.scoring(this.duration, action.duration);
        return Math.min(degreeNote, durationNote) ;
    }
}
