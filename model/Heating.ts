/// <reference path="CookingStep.ts" />

class Heating extends CookingStep {
    $type : string = 'Heating';
    
    constructor(stepParameters: Array<StepParameter> = []) {
        super(stepParameters);
        this.validate();
    }

    public static load(data : any) : Heating {
        let curContext : any = window;
        let stepParameters = (data.stepParameters as Array<any>).map(p => curContext[p.$type].load(p));
        let newObj : Heating = new Heating(stepParameters);
        return newObj;
    }

    getName() : string {
        return "Chauffer";
    }
    getImage() : string {
        return "camp-cooking-pot.svg";
    }
    
    getStepParameters() : Array<StepParameter> {
        return this.stepParameters;
    }
    getStepParameter(index : number) : StepParameter {
        if (index != 0 && index != 1) {
            throw "Heat has 2 StepParameters.";
        }
        return this.stepParameters[index];
    }

    validate() : void {
        if (this.stepParameters.length != 2) {
            throw "Heat should have 2 StepParameters.";
        }
        if (this.stepParameters[0].resource != null
            || this.stepParameters[1].resource != null) {
            throw "StepParameter should have not a resource.";
        }
    }

    public compare(action : ICookingStep) : string {
        if (action !instanceof Heating) {
            return "L'étape devrait être "+this.getName();
        }
        if (this.$type != action.$type) {
            return "L'étape devrait être "+this.getName();
        }
        let addIngredient = action as Heating;
        return this.compareHeat(addIngredient);
    }
    public compareHeat(action : Heating) : string {
        if (this.getStepParameter(0).value > action.getStepParameter(0).value) {
            return "La cuisson n'est pas assez chaude";
        }
        if (this.getStepParameter(0).value < action.getStepParameter(0).value) {
            return "La cuisson est trop chaude";
        }

        if (this.getStepParameter(1).value > action.getStepParameter(1).value) {
            return "La cuisson est trop courte";
        }
        if (this.getStepParameter(1).value < action.getStepParameter(1).value) {
            return "La cuisson est trop longue";
        }
        return "";
    }

    analyse(action: ICookingStep): number | null {
        if (action instanceof Heating) {
            this.analyseHeat(action);
        }
        return null;

    }

    analyseHeat(action: Heating): number | null {
        const degreeNote = RecipeAnalysis.scoring(this.getStepParameter(0).value, action.getStepParameter(0).value);
        const durationNote = RecipeAnalysis.scoring(this.getStepParameter(1).value, action.getStepParameter(1).value);
        return Math.min(degreeNote, durationNote) ;
    }
}
