/// <reference path="CookingStep.ts" />

class Brewing extends CookingStep {
    $type : string = 'Brewing';

    constructor(stepParameters: Array<StepParameter> = []) {
        super(stepParameters);
        this.validate();
    }
    
    public static load(data : any) : Brewing {
        let curContext : any = window;
        let newObj : Brewing = new Brewing();
        newObj.stepParameters = (data.stepParameters as Array<any>).map(p => curContext[p.$type].load(p));
        return newObj;
    }

    getName() : string {
        return "Fermenter";
    }
    getImage() : string {
        return "boiling-bubbles.svg";
    }
    
    getStepParameters() : Array<StepParameter> {
        return this.stepParameters;
    }
    getStepParameter(index : number) : StepParameter {
        if (index != 1) {
            throw "Brewing has only one StepParameter.";
        }
        return this.stepParameters[index];
    }

    validate() : void {
        if (this.stepParameters.length != 1) {
            throw "Brewing should have only one StepParameter.";
        }
        if (this.stepParameters[0].resource != null) {
            throw "StepParameter should have not a resource.";
        }
    }

    public compare(action : ICookingStep) : string {
        if (this.$type != action.$type) {
            return "L'étape devrait être "+this.getName();
        }
        let addIngredient = action as Brewing;
        return this.compareHeat(addIngredient);
    }
    public compareHeat(action : Brewing) : string {
        if (this.getStepParameter(0).value > action.getStepParameter(0).value) {
            return "La fermentation est trop courte";
        }
        if (this.getStepParameter(0).value < action.getStepParameter(0).value) {
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
        return RecipeAnalysis.scoring(this.getStepParameter(0).value, action.getStepParameter(0).value);
    }
}